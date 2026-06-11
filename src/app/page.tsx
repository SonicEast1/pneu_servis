import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { CONTACT_INFO } from '@/constants/contact';
import TechBackground from '@/components/TechBackground';

export const metadata: Metadata = {
  title: 'Domů | PneuservisVMK Jaroměř',
  description: 'Profesionální pneuservis v Jaroměři s dlouholetou tradicí. Výměna pneumatik, vyvážení kol, uskladnění pneu a kompletní servis.',
};

const stats = [
  { value: '15+', label: 'Let praxe' },
  { value: '10K+', label: 'Zákazníků' },
  { value: '25K+', label: 'Kol servisováno' },
  { value: '4.9★', label: 'Hodnocení' },
];

const reasons = [
  {
    icon: '⚡',
    title: 'Rychlost & Preciznost',
    description: 'Přezutí a vyvážení na počkání s kalibrovanými stroji a maximální přesností každého kroku.',
  },
  {
    icon: '🔧',
    title: 'Dlouholetá praxe',
    description: 'Více než 15 let zkušeností — Run-flat, nízkoprofilové i terénní pneumatiky bez problémů.',
  },
  {
    icon: '✓',
    title: 'Férové ceny',
    description: 'Transparentní ceník bez skrytých poplatků. Platíte za kvalitu, ne za překvapení.',
  },
  {
    icon: '🛡',
    title: 'Záruka kvality',
    description: 'Plná záruka na služby i materiál — ventily, závaží, opravné sady. Bezpečnost na prvním místě.',
  },
];

export default function HomePage() {
  return (
    <TechBackground>
      {/* ── HERO ── */}
      <section className="relative border-b border-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — copy */}
            <div>
              <div className="tech-badge tech-badge-live mb-6 animate-fadeInUp">
                Otevřeno · Jaroměř
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme leading-[1.05] mb-6 animate-fadeInUp stagger-1">
                Pneuservis
                <br />
                <span className="gradient-tech">na maximum</span>
              </h1>

              <p className="text-theme-secondary text-lg leading-relaxed mb-8 max-w-lg animate-fadeInUp stagger-2">
                Vždy nám na každém kole záleží. Profesionální péče o pneumatiky s nejmodernějším vybavením a individuálním přístupem ke každému vozu.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fadeInUp stagger-3">
                <Link href="/rezervace" className="btn-tech-primary">
                  Rezervovat termín
                </Link>
                <a href={`tel:${CONTACT_INFO.phone.raw}`} className="btn-tech-secondary">
                  {CONTACT_INFO.phone.display}
                </a>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-12 animate-fadeInUp stagger-4">
                {stats.map((s) => (
                  <div key={s.label} className="stat-readout">
                    <div className="value">{s.value}</div>
                    <div className="label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — hero image */}
            <div className="relative animate-fadeInUp stagger-2">
              <div className="hud-frame p-1 aspect-square max-w-md mx-auto lg:max-w-none">
                <div className="relative w-full h-full overflow-hidden rounded-sm" style={{ minHeight: '320px' }}>
                  <Image
                    src="/pictures_web/hero_tire.png"
                    alt="Profesionální pneuservis VMK"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'var(--hero-overlay)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14 max-w-2xl">
            <p className="section-tag">Proč my</p>
            <h2 className="section-title text-3xl sm:text-4xl lg:text-5xl mb-4">
              Řemeslná preciznost,<br />
              <span className="text-accent">lidský přístup</span>
            </h2>
            <p className="text-theme-secondary text-lg">
              Zakládáme si na preciznosti, rychlosti a férovém jednání. S vaším vozem zacházíme jako s vlastním.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reasons.map((r, i) => (
              <div key={r.title} className={`tech-panel animate-fadeInUp stagger-${i + 1}`}>
                <div className="mb-4">
                  <span className="text-3xl">{r.icon}</span>
                </div>
                <h3 className="font-display font-semibold text-theme text-lg mb-2">{r.title}</h3>
                <p className="text-theme-secondary text-sm leading-relaxed">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION STRIP ── */}
      <section className="border-y border-theme bg-surface-alt transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div>
              <p className="section-tag">Kde nás najdete</p>
              <h3 className="font-display text-2xl font-bold text-theme">Nová provozovna v Jaroměři</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <span className="font-display text-xs font-bold tracking-widest uppercase text-theme-muted block mb-1">Adresa</span>
                <span className="text-theme font-semibold">{CONTACT_INFO.address.full}</span>
              </div>
              <div>
                <span className="font-display text-xs font-bold tracking-widest uppercase text-theme-muted block mb-1">Telefon</span>
                <a href={`tel:${CONTACT_INFO.phone.raw}`} className="text-accent font-semibold hover:underline">
                  {CONTACT_INFO.phone.display}
                </a>
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Link href="/kontakty" className="btn-tech-secondary">
                Zobrazit na mapě →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-band py-20 lg:py-28">
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <p className="section-tag justify-center mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Rezervace online
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Potřebujete přezout nebo vyvážit kola?
          </h2>
          <p className="text-lg mb-10 opacity-75">
            Rezervujte si termín online během 2 minut, nebo nám rovnou zavolejte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rezervace" className="btn-tech-primary">
              Rezervovat online
            </Link>
            <a href={`tel:${CONTACT_INFO.phone.raw}`} className="btn-tech-secondary" style={{ color: '#f0ede6', borderColor: 'rgba(255,255,255,0.3)' }}>
              Zavolat nyní
            </a>
          </div>
        </div>
      </section>
    </TechBackground>
  );
}
