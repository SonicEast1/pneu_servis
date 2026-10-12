import { NextRequest, NextResponse } from 'next/server';
import { STATS_COOKIE, verifySessionToken } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const ok = verifySessionToken(request.cookies.get(STATS_COOKIE)?.value);
  if (!ok) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(STATS_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
