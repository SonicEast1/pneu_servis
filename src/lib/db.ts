import 'server-only';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';
import * as XLSX from 'xlsx';
import { DEFAULT_OPENING_HOURS } from '@/lib/openingHours';
import { DEFAULT_PRICING } from '@/constants/pricing';
import { DEFAULT_SERVICES, LEGACY_UNAVAILABLE, type Service } from '@/constants/services';

/**
 * Jedna SQLite databáze pro veškerý obsah, který upravuje admin.
 *
 * Soubor leží v DATA_DIR (na Rosti /srv/data). Tahle složka je mimo
 * nasazovaný kód, takže ji deploy nikdy nepřepíše ani nesmaže.
 */
export const DATA_DIR = process.env.DATA_DIR?.trim() || path.join(process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

/** Původní Excel/JSON soubory — čtou se jen jednou při prvním spuštění. */
const LEGACY_DIR = path.join(process.cwd(), 'data');

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS opening_hours (
    day INTEGER PRIMARY KEY,          -- 1 = pondělí … 7 = neděle
    hours TEXT NOT NULL               -- '8:00 - 16:00' nebo 'Zavřeno'
  );
  CREATE TABLE IF NOT EXISTS special_days (
    date TEXT PRIMARY KEY,            -- YYYY-MM-DD
    hours TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    icon TEXT NOT NULL DEFAULT '',
    price_car TEXT NOT NULL DEFAULT '',
    price_suv TEXT NOT NULL DEFAULT '',
    features TEXT NOT NULL DEFAULT '[]',
    category TEXT NOT NULL DEFAULT '',
    visible INTEGER NOT NULL DEFAULT 1,
    unavailable INTEGER NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id TEXT PRIMARY KEY,
    file TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT '',
    visible INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    rating INTEGER NOT NULL,
    text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS reservations (
    id TEXT PRIMARY KEY,
    service TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    car TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL
  );
`;

// Next v dev režimu modul načítá znovu — spojení držíme na globalThis
const globalForDb = globalThis as unknown as { vmkDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (globalForDb.vmkDb) return globalForDb.vmkDb;

  mkdirSync(UPLOAD_DIR, { recursive: true });
  const connection = new DatabaseSync(path.join(DATA_DIR, 'pneuservis.db'));
  connection.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000; PRAGMA foreign_keys = ON;');
  connection.exec(SCHEMA);
  seedOnce(connection);

  globalForDb.vmkDb = connection;
  return connection;
}

/** Spustí `work` v transakci; při chybě vrátí vše zpět. */
export function transaction<T>(work: (connection: DatabaseSync) => T): T {
  const connection = db();
  connection.exec('BEGIN IMMEDIATE');
  try {
    const result = work(connection);
    connection.exec('COMMIT');
    return result;
  } catch (error) {
    connection.exec('ROLLBACK');
    throw error;
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ─── Prvotní naplnění: původní data z Excelu, jinak výchozí hodnoty ─── */

function seedOnce(connection: DatabaseSync) {
  const seeded = connection.prepare("SELECT value FROM meta WHERE key = 'seeded'").get();
  if (seeded) return;

  connection.exec('BEGIN IMMEDIATE');
  try {
    seedOpeningHours(connection);
    seedServices(connection);
    seedPricing(connection);
    seedReviews(connection);
    seedReservations(connection);
    connection.prepare("INSERT INTO meta (key, value) VALUES ('seeded', ?)").run(new Date().toISOString());
    connection.exec('COMMIT');
  } catch (error) {
    connection.exec('ROLLBACK');
    throw error;
  }
}

function legacyRows(fileName: string): Record<string, unknown>[] {
  const file = path.join(LEGACY_DIR, fileName);
  if (!existsSync(file)) return [];
  try {
    const workbook = XLSX.read(readFileSync(file), { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
  } catch (error) {
    console.error(`Nepodařilo se načíst ${fileName}:`, error);
    return [];
  }
}

const text = (value: unknown) => (value === undefined || value === null ? '' : String(value).trim());

function seedOpeningHours(connection: DatabaseSync) {
  const insert = connection.prepare('INSERT OR REPLACE INTO opening_hours (day, hours) VALUES (?, ?)');
  DEFAULT_OPENING_HOURS.forEach((row) => insert.run(row.poradi, row.hodiny));
}

function seedServices(connection: DatabaseSync) {
  const legacy: Service[] = legacyRows('cenik_sluzby.xlsx').map((row, index) => ({
    id: text(row['ID']) || `SRV-${index + 1}`,
    nazev: text(row['Název služby']),
    popis: text(row['Popis']),
    ikona: text(row['Ikona']),
    cenaOsobni: text(row['Cena osobní auto']),
    cenaSUV: text(row['Cena SUV/Dodávka']),
    features: text(row['Funkce']).split(';').map((item) => item.trim()).filter(Boolean),
    kategorie: text(row['Kategorie']),
    aktivni: row['Aktivní'] === 'Ano' || row['Aktivní'] === true,
    nedostupna: LEGACY_UNAVAILABLE.includes(text(row['Název služby'])),
    poradi: Number(row['Pořadí'] ?? index + 1) || index + 1,
  })).filter((row) => row.nazev);

  const rows = legacy.length > 0 ? legacy : DEFAULT_SERVICES;
  const insert = connection.prepare(`
    INSERT OR REPLACE INTO services
      (id, name, description, icon, price_car, price_suv, features, category, visible, unavailable, position)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  rows.forEach((row) => insert.run(
    row.id, row.nazev, row.popis, row.ikona, row.cenaOsobni, row.cenaSUV, JSON.stringify(row.features),
    row.kategorie, row.aktivni ? 1 : 0, row.nedostupna ? 1 : 0, row.poradi,
  ));
}

function seedPricing(connection: DatabaseSync) {
  connection
    .prepare('INSERT OR REPLACE INTO content (key, value, updated_at) VALUES (?, ?, ?)')
    .run('pricing', JSON.stringify(DEFAULT_PRICING), new Date().toISOString());
}

function legacyDate(value: unknown): string {
  const raw = text(value);
  if (!raw) return new Date().toISOString();
  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

function seedReviews(connection: DatabaseSync) {
  const insert = connection.prepare(`
    INSERT OR REPLACE INTO reviews (id, name, email, rating, text, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  legacyRows('recenze_all.xlsx').forEach((row) => {
    const status = row['Status'] === 'Schváleno' ? 'approved' : row['Status'] === 'Zamítnuto' ? 'hidden' : 'pending';
    const rating = Math.min(5, Math.max(1, Number(row['Hodnocení']) || 5));
    if (!text(row['Jméno']) || !text(row['Recenze'])) return;
    insert.run(
      text(row['ID']) || newId('REV'), text(row['Jméno']), text(row['Email']), rating,
      text(row['Recenze']), status, legacyDate(row['Vytvořeno']),
    );
  });
}

function seedReservations(connection: DatabaseSync) {
  const insert = connection.prepare(`
    INSERT OR REPLACE INTO reservations (id, service, date, time, name, email, phone, car, note, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  legacyRows('rezervace_all.xlsx').forEach((row) => {
    const status = row['Status'] === 'Potvrzeno' ? 'confirmed' : row['Status'] === 'Zrušeno' ? 'cancelled' : 'pending';
    const date = legacyDate(row['Datum']).slice(0, 10);
    if (!text(row['Jméno'])) return;
    insert.run(
      text(row['ID']) || newId('RES'), text(row['Služba']), date, text(row['Čas']), text(row['Jméno']),
      text(row['Email']), text(row['Telefon']), text(row['Vozidlo']), text(row['Poznámka']),
      status, legacyDate(row['Vytvořeno']),
    );
  });
}
