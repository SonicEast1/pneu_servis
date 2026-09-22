'use client';

import { useSyncExternalStore } from 'react';

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

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light' as const);

  const setThemeMode = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="theme-pill" role="group" aria-label="Přepnout vzhled">
      <button
        onClick={() => setThemeMode('light')}
        className={`theme-pill-btn ${theme === 'light' ? 'active' : ''}`}
        aria-pressed={theme === 'light'}
        aria-label="Světlý motiv"
      >
        ☀ Světlý
      </button>
      <button
        onClick={() => setThemeMode('dark')}
        className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
        aria-pressed={theme === 'dark'}
        aria-label="Tmavý motiv"
      >
        ◑ Tmavý
      </button>
    </div>
  );
}
