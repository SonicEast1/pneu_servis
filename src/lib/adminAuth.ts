import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Přihlášení do adminu. Jméno a heslo jsou v proměnných prostředí
 * (ADMIN_USERNAME, ADMIN_PASSWORD) — nikdy v kódu, repozitář je veřejný.
 * Při vývoji bez nastaveného hesla platí admin / admin.
 */
const DEV_PASSWORD = 'admin';

export const ADMIN_COOKIE = 'vmk_admin_session';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

function adminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || 'admin';
}

function adminPassword(): string | null {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === 'production' ? null : DEV_PASSWORD;
}

/** V produkci bez hesla se do adminu nedá přihlásit vůbec. */
export function adminConfigured(): boolean {
  return adminPassword() !== null;
}

// Tajemství pro podpis odvozené z hesla → změna hesla odhlásí všechny relace
function secret(): string {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  return createHash('sha256').update(`vmk-admin:${adminPassword() ?? ''}`).digest('hex');
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function credentialsMatch(username: string, password: string): boolean {
  const expected = adminPassword();
  if (expected === null) return false;
  // Obě porovnání vždy proběhnou → délka odpovědi neprozradí, co nesedělo
  const userOk = safeEqual(username.trim().toLowerCase(), adminUsername().toLowerCase());
  const passOk = safeEqual(password, expected);
  return userOk && passOk;
}

export function createSessionToken(): string {
  const payload = String(Date.now() + ADMIN_SESSION_SECONDS * 1000);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token || !adminConfigured()) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  if (!safeEqual(token.slice(dot + 1), sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

export function isAdminRequest(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

/** Pro serverové komponenty (layout adminu). */
export async function isAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Vrátí odpověď 401, pokud požadavek nepřišel od přihlášeného admina. */
export function denyUnlessAdmin(request: NextRequest): NextResponse | null {
  if (isAdminRequest(request)) return null;
  return NextResponse.json({ error: 'Nejste přihlášeni.' }, { status: 401 });
}
