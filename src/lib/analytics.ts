import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import {
  PAGE_LABELS,
  type AnalyticsEvent,
  type AnalyticsSummary,
  type ClickCategory,
  type DailyPoint,
  type RankedItem,
} from '@/lib/analyticsTypes';

export type { AnalyticsEvent, AnalyticsSummary, ClickCategory, DailyPoint, RankedItem };
export { PAGE_LABELS };

interface DayBucket {
  pageviews: number;
  clicks: number;
  sessions: number;
  pages: Record<string, number>;
  clicksByKey: Record<string, number>;
}

interface AnalyticsStore {
  updatedAt: string;
  days: Record<string, DayBucket>;
}

const FILE = path.join(process.cwd(), 'data', 'analytics.json');
const MAX_DAYS = 90;
const ALLOWED_CATEGORIES: ClickCategory[] = ['card', 'cta', 'nav', 'click'];

let writeQueue: Promise<unknown> = Promise.resolve();

function emptyDay(): DayBucket {
  return { pageviews: 0, clicks: 0, sessions: 0, pages: {}, clicksByKey: {} };
}

export function pragueDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Prague',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function pageLabel(pathName: string): string {
  return PAGE_LABELS[pathName] ?? pathName;
}

function clickKey(category: ClickCategory, label: string): string {
  return `${category}::${label}`;
}

function parseClickKey(key: string): { category: ClickCategory; label: string } {
  const sep = key.indexOf('::');
  if (sep === -1) return { category: 'click', label: key };
  const category = key.slice(0, sep) as ClickCategory;
  const label = key.slice(sep + 2);
  return {
    category: ALLOWED_CATEGORIES.includes(category) ? category : 'click',
    label,
  };
}

function sanitizePath(raw: string): string | null {
  const trimmed = raw.split('?')[0].split('#')[0].trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('/admin') || trimmed.startsWith('/api')) {
    return null;
  }
  if (trimmed.length > 80 || !/^\/[a-zA-Z0-9\-/_]*$/.test(trimmed)) {
    return null;
  }
  return trimmed.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
}

function sanitizeLabel(raw: string | undefined): string {
  return (raw ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
}

function sanitizeCategory(raw: string | undefined): ClickCategory {
  return ALLOWED_CATEGORIES.includes(raw as ClickCategory) ? (raw as ClickCategory) : 'click';
}

async function ensureDataDir() {
  await mkdir(path.dirname(FILE), { recursive: true });
}

async function readStore(): Promise<AnalyticsStore> {
  try {
    const raw = await readFile(FILE, 'utf8');
    const parsed = JSON.parse(raw) as AnalyticsStore;
    if (!parsed || typeof parsed !== 'object' || !parsed.days) {
      return { updatedAt: new Date().toISOString(), days: {} };
    }
    return parsed;
  } catch {
    return { updatedAt: new Date().toISOString(), days: {} };
  }
}

function pruneDays(store: AnalyticsStore) {
  const keys = Object.keys(store.days).sort();
  if (keys.length <= MAX_DAYS) return;
  for (const key of keys.slice(0, keys.length - MAX_DAYS)) {
    delete store.days[key];
  }
}

async function writeStore(store: AnalyticsStore) {
  pruneDays(store);
  store.updatedAt = new Date().toISOString();
  await ensureDataDir();
  await writeFile(FILE, JSON.stringify(store), 'utf8');
}

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const next = writeQueue.then(fn, fn);
  writeQueue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}

export async function recordEvent(event: AnalyticsEvent): Promise<boolean> {
  const pathName = sanitizePath(event.path);
  if (!pathName) return false;

  return withLock(async () => {
    const store = await readStore();
    const dayKey = pragueDateKey();
    const day = store.days[dayKey] ?? emptyDay();

    if (event.type === 'pageview') {
      day.pageviews += 1;
      day.pages[pathName] = (day.pages[pathName] ?? 0) + 1;
      if (event.sessionNew) day.sessions += 1;
    } else {
      const label = sanitizeLabel(event.label);
      if (!label) return false;
      const category = sanitizeCategory(event.category);
      const key = clickKey(category, label);
      day.clicks += 1;
      day.clicksByKey[key] = (day.clicksByKey[key] ?? 0) + 1;
    }

    store.days[dayKey] = day;
    await writeStore(store);
    return true;
  });
}

function listDateKeys(days: number | null, today = pragueDateKey()): string[] {
  if (!days || days <= 0) return [];
  const keys: string[] = [];
  const now = new Date(`${today}T12:00:00+02:00`);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(pragueDateKey(d));
  }
  return keys;
}

function rank(map: Record<string, number>): RankedItem[] {
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
    .map(({ key, count }) => {
      if (key.includes('::')) {
        const parsed = parseClickKey(key);
        return { label: parsed.label, category: parsed.category, count };
      }
      return { label: pageLabel(key), path: key, count };
    });
}

export async function getSummary(days: number | null): Promise<AnalyticsSummary> {
  const store = await readStore();
  const today = pragueDateKey();
  const allKeys = Object.keys(store.days).sort();
  const keys = days && days > 0 ? listDateKeys(days, today) : allKeys;
  const activeKeys = days && days > 0 ? keys : allKeys;

  const pages: Record<string, number> = {};
  const clicksByKey: Record<string, number> = {};
  let pageviews = 0;
  let clicks = 0;
  let sessions = 0;

  const daily: DailyPoint[] = activeKeys.map((date) => {
    const bucket = store.days[date] ?? emptyDay();
    pageviews += bucket.pageviews;
    clicks += bucket.clicks;
    sessions += bucket.sessions;
    for (const [p, n] of Object.entries(bucket.pages)) {
      pages[p] = (pages[p] ?? 0) + n;
    }
    for (const [k, n] of Object.entries(bucket.clicksByKey)) {
      clicksByKey[k] = (clicksByKey[k] ?? 0) + n;
    }
    return {
      date,
      pageviews: bucket.pageviews,
      clicks: bucket.clicks,
      sessions: bucket.sessions,
    };
  });

  const rankedClicks = rank(clicksByKey);

  return {
    from: activeKeys[0] ?? today,
    to: activeKeys[activeKeys.length - 1] ?? today,
    totals: { pageviews, clicks, sessions },
    pages: rank(pages),
    clicks: rankedClicks,
    cards: rankedClicks.filter((item) => item.category === 'card'),
    daily,
  };
}
