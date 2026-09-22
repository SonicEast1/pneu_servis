'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  DEFAULT_OPENING_HOURS,
  getOpenStatus,
  type OpeningHour,
} from '@/lib/openingHours';

export default function OpenStatusBar() {
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_OPENING_HOURS);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const refreshNow = () => setNow(Date.now());
    refreshNow();

    let cancelled = false;
    fetch('/api/oteviraci-doba')
      .then((response) => response.json())
      .then((data: { hours?: OpeningHour[] }) => {
        if (!cancelled && Array.isArray(data.hours) && data.hours.length > 0) {
          setHours(data.hours);
        }
      })
      .catch(() => {});

    const interval = window.setInterval(refreshNow, 15_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshNow();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const ready = now !== null;
  const status = ready
    ? getOpenStatus(hours, new Date(now))
    : { isOpen: false, label: 'Otevírací doba', detail: 'Jaroměř', todayHours: '' };

  return (
    <Link
      href="/kontakty#oteviraci-doba"
      className={`status-bar${ready && status.isOpen ? ' status-bar-open' : ''}${ready && !status.isOpen ? ' status-bar-closed' : ''}${!ready ? ' status-bar-pending' : ''}`}
      aria-live="polite"
    >
      <span className="status-bar-inner">
        <span className={`status-dot${ready && status.isOpen ? ' status-dot-live' : ''}`} aria-hidden />
        <span className="status-bar-label">{status.label}</span>
        <span className="status-bar-sep" aria-hidden>
          ·
        </span>
        <span className="status-bar-detail">{status.detail}</span>
      </span>
    </Link>
  );
}
