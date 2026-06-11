'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t border-theme animate-slideUp transition-colors duration-400"
      style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="flex-1 text-sm text-theme-secondary">
          <span className="font-mono-tech text-[0.65rem] text-tech block mb-1">// COOKIES</span>
          Používáme cookies pro zlepšení vašeho zážitku. Pokračováním souhlasíte s jejich použitím.
        </p>
        <div className="flex gap-2">
          <button
            onClick={declineCookies}
            className="btn-tech-secondary text-xs py-2 px-4 cursor-pointer"
          >
            Odmítnout
          </button>
          <button
            onClick={acceptCookies}
            className="btn-tech-primary text-xs py-2 px-4 cursor-pointer"
          >
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );
}
