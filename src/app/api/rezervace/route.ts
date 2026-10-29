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
import { RESERVATIONS_ENABLED } from '@/constants/reservation';

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
  if (!allowed(request)) {
    return NextResponse.json({ error: 'Příliš mnoho pokusů. Zavolejte nám prosím.' }, { status: 429 });
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
    note: clip(body.note, 500),
  };

  if (!input.service || !input.date || !input.time || !input.name || !input.email || !input.phone) {
    return NextResponse.json({ error: 'Všechna povinná pole musí být vyplněna.' }, { status: 400 });
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
