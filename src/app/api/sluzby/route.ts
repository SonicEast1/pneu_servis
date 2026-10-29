import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin, isAdminRequest } from '@/lib/adminAuth';
import { deleteService, listServices, reorderServices, saveService } from '@/lib/content';
import type { Service } from '@/constants/services';

export const dynamic = 'force-dynamic';

const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

export async function GET(request: NextRequest) {
  // ?all=1 vrátí i skryté služby — jen pro admina
  const all = request.nextUrl.searchParams.get('all') === '1' && isAdminRequest(request);
  return NextResponse.json(
    { services: listServices({ onlyVisible: !all }) },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}

/** Vytvoří novou službu, nebo uloží existující (podle id). */
export async function POST(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  let body: Partial<Service>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }

  const nazev = clip(body.nazev, 80);
  if (!nazev) {
    return NextResponse.json({ error: 'Služba musí mít název.' }, { status: 400 });
  }

  const service = saveService({
    id: typeof body.id === 'string' ? body.id : undefined,
    nazev,
    popis: clip(body.popis, 400),
    ikona: clip(body.ikona, 8),
    cenaOsobni: clip(body.cenaOsobni, 40),
    cenaSUV: clip(body.cenaSUV, 40),
    features: (Array.isArray(body.features) ? body.features : [])
      .map((item) => clip(item, 60))
      .filter(Boolean)
      .slice(0, 8),
    kategorie: clip(body.kategorie, 40),
    aktivni: body.aktivni !== false,
    nedostupna: body.nedostupna === true,
  });
  return NextResponse.json({ service });
}

/** Nové pořadí: { order: [id, id, …] } */
export async function PATCH(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const body = await request.json().catch(() => ({}));
  if (!Array.isArray(body.order)) {
    return NextResponse.json({ error: 'Chybí pořadí.' }, { status: 400 });
  }
  reorderServices(body.order.map(String));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id || !deleteService(id)) {
    return NextResponse.json({ error: 'Služba nebyla nalezena.' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
