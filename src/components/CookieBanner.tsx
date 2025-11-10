'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-neutral-900/95 backdrop-blur-sm border-t border-orange-500/20 animate-slideUp">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-gray-300">
          <p>
            Používáme cookies pro zlepšení vašeho zážitku na našem webu. 
            Pokračováním souhlasíte s naším používáním cookies.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          >
            Odmítnout
          </button>
          <button
            onClick={acceptCookies}
            className="px-6 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );
}

