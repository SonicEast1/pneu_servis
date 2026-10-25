'use client';

import { useState } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

const EXIT_MS = 180; // musí sedět s .cookie-banner[data-leaving] v globals.css

export default function CookieBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();
  const [leaving, setLeaving] = useState(false);

  if (!showBanner) return null;

  // Lišta odjede stejnou cestou, kudy přijela (dolů), a teprve pak se uloží volba
  const dismiss = (commit: () => void) => {
    if (leaving) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setLeaving(true);
    window.setTimeout(commit, reduce ? 0 : EXIT_MS);
  };

  return (
    <div
      className="cookie-banner fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-theme"
      data-leaving={leaving}
      role="region"
      aria-label="Souhlas s cookies"
      style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex-1 text-sm text-theme-secondary">
          <span className="font-mono-tech text-[0.65rem] text-tech block mb-1">{'// COOKIES'}</span>
          Používáme cookies pro zlepšení vašeho zážitku. Pokračováním souhlasíte s jejich použitím.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => dismiss(declineCookies)}
            className="btn-tech-secondary btn-compact"
          >
            Odmítnout
          </button>
          <button
            type="button"
            onClick={() => dismiss(acceptCookies)}
            className="btn-tech-primary btn-compact"
          >
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );
}
