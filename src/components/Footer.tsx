'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONTACT_INFO } from '@/constants/contact';

interface Service {
  id: string;
  nazev: string;
  aktivni: boolean;
  poradi?: number;
}

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch('/api/sluzby')
      .then((r) => r.json())
      .then((data) => {
        const active = (data.services || [])
          .filter((s: Service) => s.aktivni)
          .sort((a: Service, b: Service) => (a.poradi || 0) - (b.poradi || 0))
          .slice(0, 6);
        setServices(active);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-10 bg-surface border-t border-theme transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-theme p-1">
                <img src="/logoWeb.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-display font-bold text-theme text-lg tracking-tight">
                  PNEUSERVIS<span className="text-accent">VMK</span>
                </span>
                <p className="font-display text-[0.65rem] font-semibold text-theme-muted tracking-wide">Jaroměř · od 2009</p>
              </div>
            </div>
            <p className="text-theme-secondary text-sm leading-relaxed">
              Profesionální pneuservis s důrazem na preciznost, bezpečnost a férové jednání. Vždy nám na každém kole záleží.
            </p>
            <div className="flex gap-2">
              {[
                { href: CONTACT_INFO.socials.facebook, label: 'Facebook', icon: 'f' },
                { href: CONTACT_INFO.socials.instagram, label: 'Instagram', icon: '◎' },
                { href: CONTACT_INFO.socials.tiktok, label: 'TikTok', icon: '♪' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  className="w-9 h-9 border border-theme flex items-center justify-center font-mono-tech text-xs text-theme-muted hover:text-accent hover:border-[var(--accent)] transition-all duration-300"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="section-tag">Navigace</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Domů' },
                { href: '/recenze', label: 'Recenze' },
                { href: '/rezervace', label: 'Rezervace' },
                { href: '/galerie', label: 'Galerie' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-theme-secondary hover:text-accent transition-colors font-display font-semibold text-sm">
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-tag">Služby</h3>
            {services.length > 0 ? (
              <ul className="space-y-2.5">
                {services.map((s) => (
                  <li key={s.id} className="text-theme-secondary text-sm">
                    ▸ {s.nazev}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-theme-muted text-xs">načítání...</p>
            )}
          </div>

          <div>
            <h3 className="section-tag">Kontakt</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-theme-secondary">
                <span className="font-display text-[0.65rem] font-bold tracking-widest uppercase text-theme-muted block mb-0.5">Adresa</span>
                {CONTACT_INFO.address.street}<br />
                {CONTACT_INFO.address.zip} {CONTACT_INFO.address.city}
              </li>
              <li>
                <span className="font-display text-[0.65rem] font-bold tracking-widest uppercase text-theme-muted block mb-0.5">Telefon</span>
                <a href={`tel:${CONTACT_INFO.phone.raw}`} className="text-theme font-semibold hover:text-accent transition-colors">
                  {CONTACT_INFO.phone.display}
                </a>
              </li>
              <li>
                <span className="font-display text-[0.65rem] font-bold tracking-widest uppercase text-theme-muted block mb-0.5">E-mail</span>
                <a href={`mailto:${CONTACT_INFO.email.raw}`} className="text-theme-secondary hover:text-accent transition-colors break-all text-xs">
                  {CONTACT_INFO.email.display}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-theme flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-display text-[0.7rem] font-semibold text-theme-muted tracking-wide">
            © {new Date().getFullYear()} PneuservisVMK · Všechna práva vyhrazena
          </p>
          <div className="flex gap-5 font-display text-[0.7rem] font-semibold text-theme-muted">
            <Link href="#" className="hover:text-accent transition-colors">GDPR</Link>
            <Link href="#" className="hover:text-accent transition-colors">PODMÍNKY</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
