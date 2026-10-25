'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { CONTACT_INFO } from '@/constants/contact';
import ThemeToggle from '@/components/ThemeToggle';
import OpenStatusBar from '@/components/OpenStatusBar';
import { IconPhone } from '@/components/Icons';
import { RESERVATIONS_ENABLED } from '@/constants/reservation';

const navItems = [
  { href: '/', label: 'Domů' },
  { href: '/o-nas', label: 'O nás' },
  { href: '/sluzby', label: 'Služby' },
  { href: '/cenik', label: 'Ceník' },
  { href: '/recenze', label: 'Recenze' },
  { href: '/rezervace', label: 'Rezervace' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/kontakty', label: 'Kontakty' },
].filter((item) => RESERVATIONS_ENABLED || item.href !== '/rezervace');

// useLayoutEffect na serveru varuje — na klientu chceme měřit před vykreslením
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Aktivní pilulka v desktopové navigaci. Místo skákání mezi odkazy přejede
 * na novou stránku (prostorová návaznost). Animuje se jen clip-path překryvné
 * kopie odkazů — barva textu se tak mění přesně na hraně pilulky.
 */
function useActiveClip(pathname: string) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [clip, setClip] = useState<string | null>(null);
  // Přechod zapneme až snímek po prvním změření — jinak by pilulka při
  // načtení stránky „vjela" zleva.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (clip === null || ready) return;
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, [clip, ready]);

  const measure = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const active = row.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) {
      setClip(null);
      return;
    }
    const left = active.offsetLeft;
    const right = row.offsetWidth - (active.offsetLeft + active.offsetWidth);
    setClip(`inset(0 ${right}px 0 ${left}px round 980px)`);
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();
  }, [pathname, measure]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    // Šířky odkazů se změní po načtení webfontu → přeměřit
    const ro = new ResizeObserver(() => measure());
    ro.observe(row);
    return () => ro.disconnect();
  }, [measure]);

  return { rowRef, clip, ready };
}

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { rowRef, clip, ready } = useActiveClip(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Zavřít mobilní menu klávesou Escape a vrátit fokus na tlačítko
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => pathname === href;

  return (
    <header className="site-header">
      <OpenStatusBar />
      <nav aria-label="Hlavní navigace">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-[72px]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 border border-theme p-1 transition-colors duration-150 group-hover:border-[var(--accent)]">
                <Image
                  src="/pictures_web/VMKLogo_Icona.ico"
                  alt="PneuservisVMK Logo"
                  fill
                  className="object-contain"
                  sizes="40px"
                  unoptimized
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-base text-theme tracking-tight group-hover:text-accent transition-colors">
                  PNEUSERVIS<span className="text-accent">VMK</span>
                </span>
                <span className="font-display text-[0.65rem] font-semibold text-theme-muted tracking-wide mt-0.5">
                  Pneuservis Jaroměř
                </span>
              </div>
            </Link>

            <div className="nav-links hidden lg:flex items-center gap-0.5" ref={rowRef}>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  // Než JS změří pozici, ukáže aktivní stav samotný odkaz (SSR / bez JS)
                  className={`nav-link-tech ${clip === null && isActive(item.href) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
              <div
                className="nav-links-active"
                aria-hidden="true"
                data-ready={ready && clip !== null}
                style={clip ? { clipPath: clip } : undefined}
              >
                {navItems.map((item) => (
                  <span key={item.href} className="nav-link-tech">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {/* Mezi lg a xl se řádek s odkazy nevejde i s číslem → jen ikona */}
              <a
                href={`tel:${CONTACT_INFO.phone.raw}`}
                className="btn-tech-primary btn-compact"
                aria-label={`Zavolat ${CONTACT_INFO.phone.display}`}
              >
                <IconPhone />
                <span className="lg:hidden xl:inline">{CONTACT_INFO.phone.display}</span>
              </a>
            </div>

            {/* Hamburger až do lg — mezi md a lg dřív chyběla navigace úplně */}
            <div className="flex items-center gap-2 lg:hidden">
              <div className="md:hidden">
                <ThemeToggle />
              </div>
              <button
                ref={toggleRef}
                type="button"
                className="menu-toggle"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Zavřít menu' : 'Otevřít menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="menu-toggle-bars" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Vždy v DOM → menu má i zavírací animaci; zavřené je inert (mimo fokus i čtečky) */}
        <div
          id="mobile-menu"
          className="mobile-menu lg:hidden"
          data-open={mobileMenuOpen}
          inert={!mobileMenuOpen}
        >
          <div className="px-4 pt-2 pb-5 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`block nav-link-tech ${isActive(item.href) ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <a href={`tel:${CONTACT_INFO.phone.raw}`} className="btn-tech-primary w-full mt-3 text-xs">
              <IconPhone />
              {CONTACT_INFO.phone.display}
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
