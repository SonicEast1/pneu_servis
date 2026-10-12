import { createHmac, timingSafeEqual } from 'crypto';

const ADMIN_USER = 'PneuservisVMK';
const ADMIN_PASS = 'Admin123!';
const SECRET = 'vmk-stats-session-v1';

export const STATS_COOKIE = 'vmk_stats_session';
export const STATS_SESSION_SECONDS = 60 * 60 * 12;

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function credentialsMatch(username: string, password: string): boolean {
  return safeEqual(username, ADMIN_USER) && safeEqual(password, ADMIN_PASS);
}

export function createSessionToken(): string {
  const exp = Date.now() + STATS_SESSION_SECONDS * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!safeEqual(mac, sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}
