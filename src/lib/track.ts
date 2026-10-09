export type TrackCategory = 'card' | 'cta' | 'nav' | 'click';

interface TrackPayload {
  type: 'pageview' | 'click';
  path: string;
  label?: string;
  category?: TrackCategory;
  sessionNew?: boolean;
}

const SESSION_KEY = 'vmk_sid';

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
  sendTrack({
    type: 'pageview',
    path,
    sessionNew: consumeNewSession(),
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
