import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin } from '@/lib/adminAuth';
import { getOpeningHours, getSpecialDays, saveOpeningHours } from '@/lib/content';
import { CLOSED, type SpecialDay } from '@/lib/openingHours';

export const dynamic = 'force-dynamic';

// '8:00 - 16:00' nebo víc úseků oddělených čárkou: '8:00 - 12:00, 13:00 - 16:00'
const RANGE = /^\d{1,2}:\d{2} - \d{1,2}:\d{2}(, \d{1,2}:\d{2} - \d{1,2}:\d{2})*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function validHours(value: unknown): value is string {
  return typeof value === 'string' && (value === CLOSED || RANGE.test(value));
}

export async function GET() {
  return NextResponse.json(
    { hours: getOpeningHours(), specials: getSpecialDays() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

export async function PUT(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  let body: { week?: { day: number; hodiny: string }[]; specials?: SpecialDay[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }

  const week = Array.isArray(body.week) ? body.week : [];
  const specials = Array.isArray(body.specials) ? body.specials : [];

  const weekOk = week.length === 7
    && week.every((row) => Number.isInteger(row.day) && row.day >= 1 && row.day <= 7 && validHours(row.hodiny));
  if (!weekOk) {
    return NextResponse.json({ error: 'Zkontrolujte časy: konec musí být po začátku.' }, { status: 400 });
  }

  const specialsOk = specials.every((row) => DATE.test(String(row.date)) && validHours(row.hodiny));
  if (!specialsOk) {
    return NextResponse.json({ error: 'U mimořádného dne chybí datum nebo časy.' }, { status: 400 });
  }

  saveOpeningHours(
    week,
    specials.map((row) => ({ date: row.date, hodiny: row.hodiny, note: String(row.note ?? '').slice(0, 120) })),
  );
  return NextResponse.json({ hours: getOpeningHours(), specials: getSpecialDays() });
}
