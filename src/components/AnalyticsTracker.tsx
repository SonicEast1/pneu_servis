'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackClick, trackPageview, type TrackCategory } from '@/lib/track';

function textOf(el: Element): string {
  return (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
}

function resolveClick(target: EventTarget | null): { label: string; category: TrackCategory } | null {
  if (!(target instanceof Element)) return null;

  const tracked = target.closest('[data-track]');
  if (tracked instanceof HTMLElement) {
    const label = tracked.getAttribute('data-track')?.trim();
    if (!label) return null;
    const category = (tracked.getAttribute('data-track-cat') as TrackCategory) || 'click';
    return { label, category };
  }

  const link = target.closest('a');
  if (!(link instanceof HTMLAnchorElement)) return null;
  if (link.closest('[data-no-track]')) return null;

  const href = link.getAttribute('href') || '';
  if (href.startsWith('/admin') || href.startsWith('#')) return null;

  if (href.startsWith('tel:')) return { label: 'Telefon', category: 'cta' };
  if (href.startsWith('mailto:')) return { label: 'E-mail', category: 'cta' };

  const label = textOf(link) || href;
  if (!label) return null;

  if (link.closest('header') || link.closest('nav')) {
    return { label: `Menu: ${label.replace(/^→\s*/, '')}`, category: 'nav' };
  }
  if (link.closest('footer')) {
    return { label: `Patička: ${label.replace(/^→\s*/, '')}`, category: 'nav' };
  }

  return { label, category: 'cta' };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastPath = useRef('');
  const lastClick = useRef({ key: '', at: 0 });

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    trackPageview(pathname);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (window.location.pathname.startsWith('/admin')) return;
      const resolved = resolveClick(event.target);
      if (!resolved) return;

      const key = `${resolved.category}:${resolved.label}`;
      const now = Date.now();
      if (lastClick.current.key === key && now - lastClick.current.at < 800) return;
      lastClick.current = { key, at: now };
      trackClick(resolved.label, resolved.category);
    };

    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
