import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_SESSION_SECONDS, adminConfigured, createSessionToken, credentialsMatch } from '@/lib/adminAuth';

const attempts = new Map<string, { count: number; resetAt: number }>();

function clientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now > current.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
  } else {
    current.count += 1;
    if (current.count > 8) {
      return NextResponse.json({ error: 'Příliš mnoho pokusů. Zkuste to později.' }, { status: 429 });
    }
  }

  if (!adminConfigured()) {
    return NextResponse.json(
      { error: 'Heslo do adminu není nastavené (proměnná ADMIN_PASSWORD na serveru).' },
      { status: 503 },
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatná data' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!credentialsMatch(username, password)) {
    return NextResponse.json({ error: 'Špatné jméno nebo heslo.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}
