'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CONTACT_INFO } from '@/constants/contact';
import TechBackground from '@/components/TechBackground';
import MascotCTA from '@/components/MascotCTA';
import { bookingHref, BOOKING_CTA_LABEL, RESERVATIONS_ENABLED } from '@/constants/reservation';
import { isServiceTemporarilyUnavailable } from '@/constants/services';

interface Service {
  id: string;
  nazev: string;
  popis: string;
  ikona: string;
  cenaOsobni: string;
  cenaSUV: string;
  features: string;
  kategorie?: string;
  aktivni: boolean;
  poradi?: number;
}

const processSteps = [
  { title: 'Rezervace', description: 'Zarezervujte si termín online nebo zavolejte — rychle a bez čekání.' },
  { title: 'Příjezd', description: 'Přijeďte v domluvený čas. Přijmeme váš vůz a domluvíme podrobnosti.' },
  { title: 'Servis', description: 'Profesionální přezutí nebo vyvážení na kalibrovaných strojích.' },
  { title: 'Platba', description: 'Transparentní cena dle ceníku, platba v hotovosti nebo kartou.' },
];

export default function SluzbyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sluzby')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <TechBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--accent)] mx-auto mb-4" />
            <p className="text-theme-secondary">Načítám služby...</p>
          </div>
        </div>
      </TechBackground>
    );
  }

  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Služby</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Naše <span className="gradient-tech">služby</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Kompletní přehled služeb. Profesionální péče o vaše pneumatiky a kola.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      {services.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="section-tag">Co nabízíme</p>
              <h2 className="section-title text-3xl sm:text-4xl font-bold">Přehled služeb</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, index) => {
                const unavailable = isServiceTemporarilyUnavailable(service.nazev);
                return (
                <div
                  key={service.id}
                  className={`tech-panel animate-fadeInUp stagger-${(index % 4) + 1} ${unavailable ? 'service-unavailable' : ''}`}
                >
                  {unavailable && (
                    <span className="service-unavailable-badge relative z-10">Momentálně nedostupné</span>
                  )}
                  <div className={`text-4xl mb-4 ${unavailable ? 'relative z-10' : ''}`}>{service.ikona}</div>
                  <h3 className={`font-display text-xl font-bold mb-2 ${unavailable ? 'text-theme-muted relative z-10' : 'text-theme'}`}>
                    {service.nazev}
                  </h3>
                  <p className={`text-theme-secondary text-sm ${unavailable ? 'relative z-10' : ''} ${unavailable ? 'mb-0' : 'mb-4'}`}>
                    {service.popis}
                  </p>
                  {service.features && !unavailable && (
                    <ul className="space-y-1.5">
                      {service.features.split(';').map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-theme-secondary text-sm">
                          <span className="text-accent font-bold">✓</span>
                          {f.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="border-y border-theme bg-surface-alt py-16 lg:py-20 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-tag justify-center">Jak to funguje</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold">
              Od rezervace po dokončení
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className={`animate-fadeInUp stagger-${index + 1}`}>
                <div className="relative mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent flex items-center justify-center text-white font-display font-bold text-xl rounded-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute left-12 top-6 w-full h-0.5 bg-[var(--border-strong)]" />
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-theme mb-2">{step.title}</h3>
                <p className="text-theme-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Link to ceník */}
      <section className="py-12 border-t border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-3">Ceník</p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-theme mb-3">
            Aktuální ceník služeb
          </h2>
          <p className="text-theme-secondary text-sm mb-6 max-w-lg mx-auto">
            Kompletní přehled cen včetně servisních paketů, montáže, vyvážení a doplňkových služeb.
          </p>
          <Link href="/cenik" className="btn-tech-primary">
            Zobrazit ceník →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <MascotCTA
        tag="Zaujala vás některá služba?"
        title={RESERVATIONS_ENABLED ? 'Rezervujte si termín ještě dnes' : 'Kontaktujte nás ještě dnes'}
        subtitle={RESERVATIONS_ENABLED ? 'Profesionální servis na počkání. Online rezervace do 2 minut.' : 'Profesionální servis na počkání. Domluvte termín telefonicky nebo e-mailem.'}
        actions={[
          { label: BOOKING_CTA_LABEL, href: bookingHref(), variant: 'primary' },
          { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
