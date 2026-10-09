import { NextRequest, NextResponse } from 'next/server';
import { getSummary, recordEvent, type AnalyticsEvent, type ClickCategory } from '@/lib/analytics';

const hits = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

function isBot(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') || '';
  return /bot|crawler|spider|preview|slurp|bingpreview|facebookexternalhit|whatsapp|telegram/i.test(ua);
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const current = hits.get(key);
  if (!current || now > current.resetAt) {
    hits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > 40;
}

export async function GET(request: NextRequest) {
  const daysRaw = request.nextUrl.searchParams.get('days');
  const parsed = daysRaw ? Number(daysRaw) : 7;
  const days = !Number.isFinite(parsed) || parsed <= 0 ? null : Math.min(90, Math.floor(parsed));

  try {
    const summary = await getSummary(days);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Chyba při čtení statistik:', error);
    return NextResponse.json({ error: 'Nepodařilo se načíst statistiky' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (isBot(request)) {
    return NextResponse.json({ ok: true });
  }

  const key = clientKey(request);
  if (rateLimited(key)) {
    return NextResponse.json({ ok: true });
  }

  let body: Partial<AnalyticsEvent>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data' }, { status: 400 });
  }

  if (body.type !== 'pageview' && body.type !== 'click') {
    return NextResponse.json({ error: 'Neplatný typ' }, { status: 400 });
  }

  const event: AnalyticsEvent = {
    type: body.type,
    path: typeof body.path === 'string' ? body.path : '/',
    label: typeof body.label === 'string' ? body.label : undefined,
    category: body.category as ClickCategory | undefined,
    sessionNew: Boolean(body.sessionNew),
  };

  try {
    await recordEvent(event);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Chyba při zápisu statistiky:', error);
    return NextResponse.json({ ok: true });
  }
}
