'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CONTACT_INFO } from '@/constants/contact';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { href: '/', label: 'Domů' },
  { href: '/o-nas', label: 'O nás' },
  { href: '/sluzby', label: 'Služby' },
  { href: '/recenze', label: 'Recenze' },
  { href: '/rezervace', label: 'Rezervace' },
  { href: '/galerie', label: 'Galerie' },
  { href: '/kontakty', label: 'Kontakty' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 border-b border-theme animate-fadeInDown transition-colors duration-400"
      style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 border border-theme p-1 transition-all duration-300 group-hover:border-[var(--accent)]">
              <img
                src="/pictures_web/VMKLogo_Icona.ico"
                alt="PneuservisVMK Logo"
                className="w-full h-full object-contain"
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

          <div className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link-tech ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <a href={`tel:${CONTACT_INFO.phone.raw}`} className="btn-tech-primary text-xs py-2.5 px-4">
              <span>📞</span>
              <span>{CONTACT_INFO.phone.display}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-theme-secondary hover:text-theme border border-theme rounded-sm cursor-pointer transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-theme animate-slideDown transition-colors duration-400">
          <div className="px-4 pt-2 pb-5 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block nav-link-tech ${pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${CONTACT_INFO.phone.raw}`}
              className="btn-tech-primary w-full mt-3 text-xs"
            >
              📞 {CONTACT_INFO.phone.display}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
