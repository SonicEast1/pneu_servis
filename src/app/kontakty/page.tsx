'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { CONTACT_INFO } from '@/constants/contact';
import TechBackground from '@/components/TechBackground';
import MascotCTA from '@/components/MascotCTA';

interface OpeningHour {
  id: string;
  den: string;
  hodiny: string;
  poradi: number;
  aktivni: boolean;
}

export default function KontaktyPage() {
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/oteviraci-doba')
      .then((r) => r.json())
      .then((data) => setOpeningHours(data.hours || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Kontakt</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Jsme tu <span className="gradient-tech">pro vás</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Kontaktujte nás telefonicky, e-mailem nebo navštivte provozovnu v Jaroměři.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quick contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <a href={`tel:${CONTACT_INFO.phone.raw}`} className="tech-panel flex items-center gap-5 group animate-fadeInUp stagger-1 no-underline">
            <div className="w-14 h-14 border border-theme rounded-sm flex items-center justify-center text-2xl text-accent group-hover:border-[var(--accent)] transition-colors flex-shrink-0">
              📞
            </div>
            <div>
              <span className="font-display text-xs font-bold tracking-widest uppercase text-theme-muted block mb-0.5">Telefon</span>
              <span className="font-display text-xl font-bold text-theme group-hover:text-accent transition-colors">
                {CONTACT_INFO.phone.display}
              </span>
              <p className="text-theme-muted text-sm mt-0.5">{CONTACT_INFO.phone.hours}</p>
            </div>
          </a>

          <a href={`mailto:${CONTACT_INFO.email.raw}`} className="tech-panel flex items-center gap-5 group animate-fadeInUp stagger-2 no-underline">
            <div className="w-14 h-14 border border-theme rounded-sm flex items-center justify-center text-2xl text-accent group-hover:border-[var(--accent)] transition-colors flex-shrink-0">
              ✉
            </div>
            <div>
              <span className="font-display text-xs font-bold tracking-widest uppercase text-theme-muted block mb-0.5">E-mail</span>
              <span className="font-display text-xl font-bold text-theme group-hover:text-accent transition-colors break-all">
                {CONTACT_INFO.email.display}
              </span>
              <p className="text-theme-muted text-sm mt-0.5">Odpovíme co nejdříve</p>
            </div>
          </a>
        </div>

        {/* Provozovna */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="tech-panel animate-fadeInUp">
            <div className="tech-badge tech-badge-live mb-5 w-fit">Hlavní provozovna</div>
            <h2 className="font-display text-2xl font-bold text-theme mb-4">Pneuservis VMK</h2>
            <p className="text-theme-secondary text-lg leading-relaxed mb-4">
              {CONTACT_INFO.address.street}<br />
              {CONTACT_INFO.address.zip} {CONTACT_INFO.address.city}<br />
              <span className="text-theme-muted text-sm">({CONTACT_INFO.address.part})</span>
            </p>
            <p className="text-theme-muted text-sm leading-relaxed border-t border-theme pt-4 mb-6">
              Veškeré pneuservisní služby — přezouvání, vyvažování, opravy defektů, výdej a uskladnění pneumatik.
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Nachodska+118+Jaromer"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tech-secondary text-xs"
            >
              Otevřít v Mapách →
            </a>
          </div>

          <div className="hud-frame overflow-hidden min-h-[350px] animate-fadeInUp stagger-1">
            <iframe
              src={CONTACT_INFO.maps.provozovna}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '350px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa - Provozovna Jaroměř"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Sídlo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="tech-panel animate-fadeInUp">
            <p className="section-tag">Sídlo společnosti</p>
            <h2 className="font-display text-2xl font-bold text-theme mb-4">{CONTACT_INFO.billing.company}</h2>
            <p className="text-theme-secondary leading-relaxed mb-4">
              {CONTACT_INFO.billing.street}<br />
              {CONTACT_INFO.billing.zip} {CONTACT_INFO.billing.city}
            </p>
            <div className="border-t border-theme pt-4 text-sm">
              <p className="text-theme-secondary">
                <span className="font-display text-xs font-bold tracking-widest uppercase text-theme-muted">IČO: </span>
                {CONTACT_INFO.billing.ico}
              </p>
              <p className="text-theme-muted text-xs mt-2 leading-relaxed">{CONTACT_INFO.billing.register}</p>
            </div>
          </div>

          <div className="hud-frame overflow-hidden min-h-[300px] animate-fadeInUp stagger-1">
            <iframe
              src={CONTACT_INFO.maps.sidlo}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '300px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa - Sídlo společnosti Praha"
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Hours + Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="tech-panel lg:col-span-2 animate-fadeInUp">
            <p className="section-tag">Otevírací doba</p>
            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--accent)] mx-auto" />
              </div>
            ) : (
              <div>
                {openingHours.map((day, i) => (
                  <div
                    key={day.id}
                    className={`flex justify-between items-center py-3 px-2 ${i < openingHours.length - 1 ? 'border-b border-theme' : ''}`}
                  >
                    <span className="font-display font-semibold text-theme">{day.den}</span>
                    <span className="font-display font-semibold text-theme-secondary">{day.hodiny}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="tech-panel animate-fadeInUp stagger-1">
            <p className="section-tag">Sociální sítě</p>
            <p className="text-theme-muted text-sm mb-5 leading-relaxed">
              Sledujte naše práce, tipy na péči o pneumatiky a novinky.
            </p>
            <div className="space-y-2">
              {[
                { href: CONTACT_INFO.socials.facebook, label: 'Facebook' },
                { href: CONTACT_INFO.socials.instagram, label: 'Instagram' },
                { href: CONTACT_INFO.socials.tiktok, label: 'TikTok' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-theme rounded text-theme-secondary hover:text-accent hover:border-[var(--accent)] transition-all font-display font-semibold text-sm"
                >
                  → {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <MascotCTA
        title="Máte dotaz nebo zájem o přezutí?"
        subtitle="Neváhejte nás kontaktovat — rádi zodpovíme dotazy nebo naplánujeme termín."
        actions={[
          { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'primary' },
          { label: 'Poslat e-mail', href: '', isEmail: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
