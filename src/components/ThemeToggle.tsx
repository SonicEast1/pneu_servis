'use client';

import { useSyncExternalStore } from 'react';
import { IconMoon, IconSun } from '@/components/Icons';

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('storage', onStoreChange);
  return () => {
    observer.disconnect();
    window.removeEventListener('storage', onStoreChange);
  };
}

function getTheme(): 'light' | 'dark' {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Přepne motiv najednou. Bez toho by každý prvek přecházel barvou vlastní
 * rychlostí (150 / 300 / 400 ms) a stránka by se na okamžik „rozpadla".
 */
function applyTheme(newTheme: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.add('theme-switching');

  root.classList.toggle('dark', newTheme === 'dark');
  root.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem('theme', newTheme);
  } catch {}

  // Vynutí přepočet stylů s vypnutými přechody, pak je vrátí.
  void window.getComputedStyle(root).opacity;
  requestAnimationFrame(() => root.classList.remove('theme-switching'));
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as const);

  return (
    <div className="theme-pill" role="group" aria-label="Přepnout vzhled">
      {/* Posuvný ukazatel — vyjmutý z .theme-switching, takže sjede i při přepnutí */}
      <span className="theme-pill-thumb" aria-hidden="true" />
      <button
        type="button"
        onClick={() => theme !== 'light' && applyTheme('light')}
        className="theme-pill-btn"
        data-mode="light"
        aria-pressed={theme === 'light'}
        aria-label="Světlý motiv"
      >
        <IconSun />
        <span className="hidden sm:inline lg:hidden xl:inline">Světlý</span>
      </button>
      <button
        type="button"
        onClick={() => theme !== 'dark' && applyTheme('dark')}
        className="theme-pill-btn"
        data-mode="dark"
        aria-pressed={theme === 'dark'}
        aria-label="Tmavý motiv"
      >
        <IconMoon />
        <span className="hidden sm:inline lg:hidden xl:inline">Tmavý</span>
      </button>
    </div>
  );
}
