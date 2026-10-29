import { NextRequest, NextResponse } from 'next/server';
import { denyUnlessAdmin } from '@/lib/adminAuth';
import { getPricing, savePricing } from '@/lib/content';
import { SIZE_COLUMNS, type Pricing, type SizedPriceRow, type SupplementaryPriceRow } from '@/constants/pricing';

export const dynamic = 'force-dynamic';

const clip = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const price = (value: unknown) => Math.max(0, Math.round(Number(value) || 0));

function cleanSized(rows: unknown): SizedPriceRow[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row: Partial<SizedPriceRow>) => ({
      name: clip(row.name, 80),
      description: clip(row.description, 160) || undefined,
      prices: Object.fromEntries(
        SIZE_COLUMNS.map((col) => [col.key, price(row.prices?.[col.key])]),
      ) as SizedPriceRow['prices'],
    }))
    .filter((row) => row.name);
}

function cleanSupplementary(rows: unknown): SupplementaryPriceRow[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row: Partial<SupplementaryPriceRow>) => ({
      name: clip(row.name, 80),
      unit: clip(row.unit, 30) || '1 ks',
      note: clip(row.note, 120) || undefined,
      price: price(row.price),
    }))
    .filter((row) => row.name);
}

export async function GET() {
  return NextResponse.json({ pricing: getPricing() }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function PUT(request: NextRequest) {
  const denied = denyUnlessAdmin(request);
  if (denied) return denied;

  let body: { pricing?: Partial<Pricing> };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data.' }, { status: 400 });
  }

  const input = body.pricing ?? {};
  const pricing: Pricing = {
    meta: {
      vatNote: clip(input.meta?.vatNote, 160),
      validFrom: clip(input.meta?.validFrom, 40),
      perUnitNote: clip(input.meta?.perUnitNote, 160),
    },
    packages: cleanSized(input.packages),
    additional: cleanSized(input.additional),
    supplementary: cleanSupplementary(input.supplementary),
  };
  savePricing(pricing);
  return NextResponse.json({ pricing });
}
