export type TrackCategory = 'card' | 'cta' | 'nav' | 'click';

interface TrackPayload {
  type: 'pageview' | 'click';
  path: string;
  label?: string;
  category?: TrackCategory;
  sessionNew?: boolean;
  source?: string;
}

const SESSION_KEY = 'vmk_sid';
const SOURCE_KEY = 'vmk_src';

function classifySource(): string {
  const params = new URLSearchParams(window.location.search);
  const utm = (params.get('utm_source') || '').toLowerCase();
  const ref = document.referrer || '';
  let host = '';
  try {
    host = new URL(ref).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    host = '';
  }

  const own = host === window.location.hostname || host.endsWith('pneuservisvmk.cz');
  if (params.get('gclid') || params.get('gad_source') || utm.includes('google') || host.includes('google.')) return 'Google';
  if (params.get('fbclid') || host.includes('facebook.') || host === 'fb.com' || host.includes('fb.me') || utm === 'facebook' || utm === 'fb') return 'Facebook';
  if (params.get('igshid') || params.get('igsh') || host.includes('instagram.') || utm === 'instagram' || utm === 'ig') return 'Instagram';
  if (params.get('sznclid') || host.includes('seznam.') || utm.includes('seznam')) return 'Seznam';
  if (host.includes('tiktok.') || utm.includes('tiktok')) return 'TikTok';
  if (host.includes('firmy.cz') || utm.includes('firmy')) return 'Firmy.cz';
  if (host.includes('mapy.cz') || host.includes('maps.')) return 'Mapy';
  if (host.includes('bing.')) return 'Bing';
  if (host.includes('youtube.') || host === 'youtu.be') return 'YouTube';
  if (!host || own) return 'Přímý vstup';
  return 'Jiný web';
}

function sessionSource(isNew: boolean): string | undefined {
  try {
    if (!isNew) return undefined;
    const source = classifySource();
    sessionStorage.setItem(SOURCE_KEY, source);
    return source;
  } catch {
    return undefined;
  }
}

function consumeNewSession(): boolean {
  try {
    if (typeof sessionStorage === 'undefined') return false;
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, '1');
    return true;
  } catch {
    return false;
  }
}

export function sendTrack(payload: TrackPayload) {
  if (typeof window === 'undefined') return;
  const path = payload.path || window.location.pathname;
  if (path.startsWith('/admin') || path.startsWith('/api')) return;

  const body = JSON.stringify({
    ...payload,
    path,
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics', blob);
      return;
    }
  } catch {
    // fallback below
  }

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

export function trackPageview(path: string) {
  const sessionNew = consumeNewSession();
  sendTrack({
    type: 'pageview',
    path,
    sessionNew,
    source: sessionSource(sessionNew),
  });
}

export function trackClick(label: string, category: TrackCategory = 'click') {
  if (!label.trim()) return;
  sendTrack({
    type: 'click',
    path: typeof window !== 'undefined' ? window.location.pathname : '/',
    label: label.trim().slice(0, 80),
    category,
  });
}
