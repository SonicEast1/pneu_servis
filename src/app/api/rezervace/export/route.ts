import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { denyUnlessAdmin } from '@/lib/adminAuth';
import { listReservations } from '@/lib/content';

export const dynamic = 'force-dynamic';

const STATUS_LABEL = { pending: 'Nová', confirmed: 'Potvrzeno', cancelled: 'Zrušeno' } as const;

/** Stáhne všechny rezervace jako Excel. */
export async function GET(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const rows = listReservations().map((r) => ({
    Datum: r.date,
    Čas: r.time,
    Služba: r.service,
    Jméno: r.name,
    Telefon: r.phone,
    Email: r.email,
    Vozidlo: r.car,
    'Rozměr kola': r.wheelSize,
    Poznámka: r.note,
    Stav: STATUS_LABEL[r.status] ?? r.status,
    Vytvořeno: new Date(r.createdAt).toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' }),
  }));

  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet['!cols'] = [10, 6, 22, 20, 15, 26, 18, 12, 40, 11, 18].map((wch) => ({ wch }));
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, 'Rezervace');
  const buffer = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' }) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="rezervace.xlsx"',
    },
  });
}
