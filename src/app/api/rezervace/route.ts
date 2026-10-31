import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin } from '@/lib/adminAuth';
import {
  createReservation,
  deleteReservation,
  listReservations,
  listServices,
  setReservationStatus,
  takenTimes,
  type ReservationStatus,
} from '@/lib/content';
import { pragueDate } from '@/lib/openingHours';
import { RESERVATIONS_ENABLED, WHEEL_SIZE_OPTIONS } from '@/constants/reservation';

export const dynamic = 'force-dynamic';

const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'cancelled'];
const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

// Jednoduchá ochrana proti zahlcení formuláře: max. 5 rezervací za 10 minut z jedné IP
const recent = new Map<string, number[]>();
function allowed(request: NextRequest): boolean {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((stamp) => now - stamp < 10 * 60_000);
  if (hits.length >= 5) return false;
  recent.set(ip, [...hits, now]);
  return true;
}

/** Veřejné: nová rezervace z formuláře. */
export async function POST(request: NextRequest) {
  if (!RESERVATIONS_ENABLED) {
    return NextResponse.json(
      { error: 'Online rezervace jsou dočasně nedostupné. Kontaktujte nás prosím telefonicky nebo e-mailem.' },
      { status: 503 },
    );
  }
  const body = await request.json().catch(() => ({}));
  const input = {
    service: clip(body.service, 60),
    date: clip(body.date, 10),
    time: clip(body.time, 5),
    name: clip(body.name, 80),
    email: clip(body.email, 120),
    phone: clip(body.phone, 30),
    car: clip(body.car, 80),
    wheelSize: clip(body.wheelSize, 40),
    note: clip(body.note, 500),
  };

  // Povinné je vše kromě poznámky
  const required = [input.service, input.date, input.time, input.name, input.email, input.phone, input.car, input.wheelSize];
  if (required.some((value) => !value)) {
    return NextResponse.json({ error: 'Vyplňte prosím všechna povinná pole.' }, { status: 400 });
  }
  if (!WHEEL_SIZE_OPTIONS.includes(input.wheelSize)) {
    return NextResponse.json({ error: 'Vyberte prosím rozměr kola ze seznamu.' }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    return NextResponse.json({ error: 'Zkontrolujte prosím e-mail.' }, { status: 400 });
  }
  if (input.phone.replace(/\D/g, '').length < 9) {
    return NextResponse.json({ error: 'Zkontrolujte prosím telefon (aspoň 9 číslic).' }, { status: 400 });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || input.date < pragueDate()) {
    return NextResponse.json({ error: 'Vyberte prosím datum od dneška dál.' }, { status: 400 });
  }
  if (!/^\d{1,2}:\d{2}$/.test(input.time)) {
    return NextResponse.json({ error: 'Vyberte prosím čas.' }, { status: 400 });
  }
  if (takenTimes(input.date).includes(input.time)) {
    return NextResponse.json({ error: 'Tento čas už je obsazený. Vyberte prosím jiný.' }, { status: 409 });
  }
  // Limit počítá jen platné rezervace — překlep ve formuláři zákazníka nezablokuje
  if (!allowed(request)) {
    return NextResponse.json({ error: 'Příliš mnoho rezervací najednou. Zavolejte nám prosím.' }, { status: 429 });
  }

  // Ukládáme název služby, ne id — rezervace zůstane čitelná i po smazání služby
  const service = listServices().find((item) => item.id === input.service);
  const reservation = createReservation({ ...input, service: service?.nazev ?? input.service });
  return NextResponse.json({ success: true, reservation: { id: reservation.id } });
}

export async function GET(request: NextRequest) {
  // Veřejně jen obsazené časy pro zvolený den (bez osobních údajů)
  const date = request.nextUrl.searchParams.get('obsazeno');
  if (date) {
    return NextResponse.json({ taken: takenTimes(date) }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const denied = denyUnlessAdmin(request);
  if (denied) return denied;
  return NextResponse.json({ reservations: listReservations() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PATCH(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  if (typeof body.id !== 'string' || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }
  if (!setReservationStatus(body.id, body.status)) {
    return NextResponse.json({ error: 'Rezervace nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id || !deleteReservation(id)) {
    return NextResponse.json({ error: 'Rezervace nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
