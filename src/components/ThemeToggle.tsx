'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const setThemeMode = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
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

  if (!mounted) {
    return <div className="theme-pill w-[108px] h-[34px]" />;
  }

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
