import 'server-only';
import { unlink } from 'fs/promises';
import path from 'path';
import { db, newId, transaction, UPLOAD_DIR } from '@/lib/db';
import { WEEK_DAYS, pragueDate, type OpeningHour, type SpecialDay } from '@/lib/openingHours';
import { DEFAULT_PRICING, withStorageSection, type Pricing } from '@/constants/pricing';
import type { Service } from '@/constants/services';

type Row = Record<string, unknown>;
const str = (value: unknown) => (value === null || value === undefined ? '' : String(value));

/* ─── Otevírací doba ─── */

export function getOpeningHours(): OpeningHour[] {
  const rows = db().prepare('SELECT day, hours FROM opening_hours ORDER BY day').all() as Row[];
  return rows.map((row) => {
    const day = Number(row.day);
    return { id: `OH-${day}`, den: WEEK_DAYS[day - 1], hodiny: str(row.hours), poradi: day, aktivni: true };
  });
}

/** Mimořádné dny od dneška dál (staré se nezobrazují ani neberou v potaz). */
export function getSpecialDays(): SpecialDay[] {
  const rows = db()
    .prepare('SELECT date, hours, note FROM special_days WHERE date >= ? ORDER BY date')
    .all(pragueDate()) as Row[];
  return rows.map((row) => ({ date: str(row.date), hodiny: str(row.hours), note: str(row.note) }));
}

export function saveOpeningHours(week: { day: number; hodiny: string }[], specials: SpecialDay[]) {
  transaction((connection) => {
    const upsert = connection.prepare('INSERT OR REPLACE INTO opening_hours (day, hours) VALUES (?, ?)');
    week.forEach((row) => upsert.run(row.day, row.hodiny));
    connection.prepare('DELETE FROM special_days').run();
    const insert = connection.prepare('INSERT OR REPLACE INTO special_days (date, hours, note) VALUES (?, ?, ?)');
    specials.forEach((special) => insert.run(special.date, special.hodiny, special.note));
  });
}

/* ─── Služby ─── */

function toService(row: Row): Service {
  let features: string[] = [];
  try {
    features = JSON.parse(str(row.features));
  } catch {
    features = [];
  }
  return {
    id: str(row.id),
    nazev: str(row.name),
    popis: str(row.description),
    ikona: str(row.icon),
    cenaOsobni: str(row.price_car),
    cenaSUV: str(row.price_suv),
    features,
    kategorie: str(row.category),
    aktivni: row.visible === 1,
    nedostupna: row.unavailable === 1,
    poradi: Number(row.position),
  };
}

export function listServices({ onlyVisible = false } = {}): Service[] {
  const where = onlyVisible ? 'WHERE visible = 1' : '';
  const rows = db().prepare(`SELECT * FROM services ${where} ORDER BY position, name`).all() as Row[];
  return rows.map(toService);
}

export function saveService(input: Omit<Service, 'id' | 'poradi'> & { id?: string }): Service {
  const connection = db();
  const id = input.id || newId('SRV');
  const existing = connection.prepare('SELECT position FROM services WHERE id = ?').get(id) as Row | undefined;
  const position = existing
    ? Number(existing.position)
    : Number((connection.prepare('SELECT COALESCE(MAX(position), 0) + 1 AS next FROM services').get() as Row).next);

  connection.prepare(`
    INSERT OR REPLACE INTO services
      (id, name, description, icon, price_car, price_suv, features, category, visible, unavailable, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id, input.nazev, input.popis, input.ikona, input.cenaOsobni, input.cenaSUV,
    JSON.stringify(input.features), input.kategorie, input.aktivni ? 1 : 0, input.nedostupna ? 1 : 0, position,
  );
  return toService(connection.prepare('SELECT * FROM services WHERE id = ?').get(id) as Row);
}

export function deleteService(id: string): boolean {
  return Number(db().prepare('DELETE FROM services WHERE id = ?').run(id).changes) > 0;
}

/** Uloží pořadí podle pole id (první = nahoře). */
function reorder(table: 'services' | 'gallery', ids: string[]) {
  transaction((connection) => {
    const update = connection.prepare(`UPDATE ${table} SET position = ? WHERE id = ?`);
    ids.forEach((id, index) => update.run(index + 1, id));
  });
}

export const reorderServices = (ids: string[]) => reorder('services', ids);

/* ─── Ceník ─── */

export function getPricing(): Pricing {
  const row = db().prepare("SELECT value FROM content WHERE key = 'pricing'").get() as Row | undefined;
  if (!row) return DEFAULT_PRICING;
  try {
    return withStorageSection({ ...DEFAULT_PRICING, storage: undefined, ...(JSON.parse(str(row.value)) as Partial<Pricing>) });
  } catch {
    return DEFAULT_PRICING;
  }
}

export function savePricing(pricing: Pricing) {
  db()
    .prepare('INSERT OR REPLACE INTO content (key, value, updated_at) VALUES (?, ?, ?)')
    .run('pricing', JSON.stringify(pricing), new Date().toISOString());
}

/* ─── Galerie ─── */

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description: string;
  categories: string[];
  visible: boolean;
}

function parseList(value: unknown): string[] {
  try {
    const list = JSON.parse(str(value));
    return Array.isArray(list) ? list.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function toImage(row: Row): GalleryImage {
  return {
    id: str(row.id),
    url: `/media/${str(row.file)}`,
    title: str(row.title),
    description: str(row.description),
    categories: parseList(row.categories),
    visible: row.visible === 1,
  };
}

export function listGallery({ onlyVisible = false } = {}): GalleryImage[] {
  const where = onlyVisible ? 'WHERE visible = 1' : '';
  const rows = db().prepare(`SELECT * FROM gallery ${where} ORDER BY position, created_at DESC`).all() as Row[];
  return rows.map(toImage);
}

export function addGalleryImage(file: string, title: string, categories: string[]): GalleryImage {
  const connection = db();
  const id = newId('IMG');
  // Nové fotky nahoru: posuneme ostatní o jedno níž
  transaction((tx) => {
    tx.prepare('UPDATE gallery SET position = position + 1').run();
    tx.prepare('INSERT INTO gallery (id, file, title, categories, visible, position, created_at) VALUES (?, ?, ?, ?, 1, 1, ?)')
      .run(id, file, title, JSON.stringify(categories), new Date().toISOString());
  });
  return toImage(connection.prepare('SELECT * FROM gallery WHERE id = ?').get(id) as Row);
}

export function updateGalleryImage(
  id: string,
  patch: { title?: string; description?: string; categories?: string[]; visible?: boolean },
) {
  const current = db().prepare('SELECT * FROM gallery WHERE id = ?').get(id) as Row | undefined;
  if (!current) return null;
  db().prepare('UPDATE gallery SET title = ?, description = ?, categories = ?, visible = ? WHERE id = ?').run(
    patch.title ?? str(current.title),
    patch.description ?? str(current.description),
    patch.categories ? JSON.stringify(patch.categories) : str(current.categories),
    patch.visible === undefined ? Number(current.visible) : patch.visible ? 1 : 0,
    id,
  );
  return toImage(db().prepare('SELECT * FROM gallery WHERE id = ?').get(id) as Row);
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const row = db().prepare('SELECT file FROM gallery WHERE id = ?').get(id) as Row | undefined;
  if (!row) return false;
  db().prepare('DELETE FROM gallery WHERE id = ?').run(id);
  await unlink(path.join(UPLOAD_DIR, path.basename(str(row.file)))).catch(() => {});
  return true;
}

export const reorderGallery = (ids: string[]) => reorder('gallery', ids);

/* ─── Recenze ─── */

export type ReviewStatus = 'pending' | 'approved' | 'hidden';

export interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  status: ReviewStatus;
  createdAt: string;
}

function toReview(row: Row): Review {
  return {
    id: str(row.id),
    name: str(row.name),
    email: str(row.email),
    rating: Number(row.rating),
    text: str(row.text),
    status: str(row.status) as ReviewStatus,
    createdAt: str(row.created_at),
  };
}

export function listReviews({ onlyApproved = false } = {}): Review[] {
  const where = onlyApproved ? "WHERE status = 'approved'" : '';
  const rows = db().prepare(`SELECT * FROM reviews ${where} ORDER BY created_at DESC`).all() as Row[];
  return rows.map(toReview);
}

export function addReview(input: { name: string; email?: string; rating: number; text: string; status: ReviewStatus }): Review {
  const id = newId('REV');
  db().prepare('INSERT INTO reviews (id, name, email, rating, text, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, input.name, input.email ?? '', input.rating, input.text, input.status, new Date().toISOString());
  return toReview(db().prepare('SELECT * FROM reviews WHERE id = ?').get(id) as Row);
}

export function updateReview(id: string, patch: Partial<Pick<Review, 'name' | 'rating' | 'text' | 'status'>>) {
  const current = db().prepare('SELECT * FROM reviews WHERE id = ?').get(id) as Row | undefined;
  if (!current) return null;
  const merged = { ...toReview(current), ...patch };
  db().prepare('UPDATE reviews SET name = ?, rating = ?, text = ?, status = ? WHERE id = ?')
    .run(merged.name, merged.rating, merged.text, merged.status, id);
  return merged;
}

export function deleteReview(id: string): boolean {
  return Number(db().prepare('DELETE FROM reviews WHERE id = ?').run(id).changes) > 0;
}

/* ─── Rezervace ─── */

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  wheelSize: string;
  note: string;
  status: ReservationStatus;
  createdAt: string;
}

function toReservation(row: Row): Reservation {
  return {
    id: str(row.id),
    service: str(row.service),
    date: str(row.date),
    time: str(row.time),
    name: str(row.name),
    email: str(row.email),
    phone: str(row.phone),
    car: str(row.car),
    wheelSize: str(row.wheel_size),
    note: str(row.note),
    status: str(row.status) as ReservationStatus,
    createdAt: str(row.created_at),
  };
}

export function listReservations(): Reservation[] {
  const rows = db().prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC').all() as Row[];
  return rows.map(toReservation);
}

/** Obsazené časy v daný den (zrušené rezervace termín uvolní). */
export function takenTimes(date: string): string[] {
  const rows = db()
    .prepare("SELECT time FROM reservations WHERE date = ? AND status != 'cancelled'")
    .all(date) as Row[];
  return rows.map((row) => str(row.time));
}

export function createReservation(input: Omit<Reservation, 'id' | 'status' | 'createdAt'>): Reservation {
  const id = newId('RES');
  db().prepare(`
    INSERT INTO reservations (id, service, date, time, name, email, phone, car, wheel_size, note, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(
    id, input.service, input.date, input.time, input.name, input.email, input.phone,
    input.car, input.wheelSize, input.note, new Date().toISOString(),
  );
  return toReservation(db().prepare('SELECT * FROM reservations WHERE id = ?').get(id) as Row);
}

export function setReservationStatus(id: string, status: ReservationStatus) {
  const result = db().prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
  return Number(result.changes) > 0;
}

export function deleteReservation(id: string): boolean {
  return Number(db().prepare('DELETE FROM reservations WHERE id = ?').run(id).changes) > 0;
}

/* ─── Přehled pro admin ─── */

export function adminCounts() {
  const count = (sql: string, ...params: string[]) => Number((db().prepare(sql).get(...params) as Row).n);
  return {
    newReservations: count("SELECT COUNT(*) AS n FROM reservations WHERE status = 'pending'"),
    upcomingReservations: count(
      "SELECT COUNT(*) AS n FROM reservations WHERE status = 'confirmed' AND date >= ?",
      pragueDate(),
    ),
    pendingReviews: count("SELECT COUNT(*) AS n FROM reviews WHERE status = 'pending'"),
    galleryImages: count('SELECT COUNT(*) AS n FROM gallery WHERE visible = 1'),
    services: count('SELECT COUNT(*) AS n FROM services WHERE visible = 1'),
  };
}
