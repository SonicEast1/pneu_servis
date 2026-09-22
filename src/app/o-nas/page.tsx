import Image from 'next/image';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import MascotCTA from '@/components/MascotCTA';
import { bookingHref, BOOKING_CTA_LABEL, RESERVATIONS_ENABLED } from '@/constants/reservation';

export const metadata: Metadata = {
  title: 'O nás',
  description: 'PneuservisVMK Jaroměř: pneuservis s více než 15 lety praxe. Přezutí, vyvážení a péče o pneumatiky na Náchodské 118.',
  alternates: { canonical: '/o-nas' },
};

const stats = [
  { value: '15+', label: 'Let zkušeností' },
  { value: '10K+', label: 'Spokojených zákazníků' },
  { value: '25K+', label: 'Vyměněných pneumatik' },
  { value: '5.0★', label: 'Hodnocení' },
];

const values = [
  {
    icon: '🎯',
    title: 'Kvalita',
    description: 'Každé kolo bereme vážně. Používáme kalibrované stroje, originální závaží a ventily, a nikdy nespěcháme na úkor přesnosti.',
  },
  {
    icon: '🤝',
    title: 'Poctivost',
    description: 'Transparentní ceník, žádné skryté poplatky. Řekneme vám pravdu o stavu vašich pneumatik — i kdyby to pro nás znamenalo méně práce.',
  },
  {
    icon: '⚡',
    title: 'Rychlost',
    description: 'Vaše auto potřebujete brzy zpátky. Snažíme se o maximální efektivitu bez ztráty kvality — přezutí 4 kol na počkání.',
  },
];

export default function ONasPage() {
  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">O nás</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Váš pneuservis<br /><span className="gradient-tech">s tradicí</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Zjistěte více o našem příběhu, hodnotách a lidech za PneuservisVMK.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <p className="section-tag">Náš příběh</p>
              <h2 className="section-title text-3xl sm:text-4xl font-bold mb-6">
                Přes 15 let<br /><span className="text-accent">na vašich kolech</span>
              </h2>
              <div className="space-y-4 text-theme-secondary text-base leading-relaxed">
                <p>
                  PneuservisVMK vznikl z jednoduché myšlenky: dělat pneuservis poctivě, rychle a za férovou cenu. Od prvního dne nám záleží na každém zákazníkovi — ať přijede s osobákem nebo s SUV.
                </p>
                <p>
                  Za roky praxe jsme se setkali s pneumatikami všeho druhu — run-flat, nízkoprofilové, terénní offroad i těžká nákladní kola. Každý případ nás naučil něco nového.
                </p>
                <p>
                  Nová provozovna v Jaroměři je vybavena moderními stroji pro montáž, demontáž a vyvažování kol. Ale co nás táhne dopředu, jsou spokojení zákazníci — a to se za 15 let nezměnilo.
                </p>
              </div>
            </div>
            <div className="animate-fadeInUp stagger-2">
              <div className="hud-frame p-2 overflow-hidden relative aspect-square">
                <Image
                  src="/pictures_web/VMKLogo.png"
                  alt="PneuservisVMK"
                  fill
                  className="object-cover rounded-sm"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-theme bg-surface-alt py-16 lg:py-20 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-tag justify-center mb-10">Naše čísla</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`stat-readout animate-fadeInUp stagger-${i + 1}`}>
                <div className="value">{stat.value}</div>
                <div className="label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-2xl">
            <p className="section-tag">Naše hodnoty</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold">
              Co nás žene<br /><span className="text-accent">každý den vpřed</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <div key={i} className={`tech-panel animate-fadeInUp stagger-${i + 1}`}>
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-display text-xl font-bold text-theme mb-2">{v.title}</h3>
                <p className="text-theme-secondary text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <MascotCTA
        tag="Přidejte se k nám"
        title="Připojte se k tisícům spokojených zákazníků"
        subtitle={RESERVATIONS_ENABLED ? 'Rezervujte termín online nebo nám zavolejte — rádi se postaráme o vaše kola.' : 'Kontaktujte nás telefonicky nebo e-mailem — rádi se postaráme o vaše kola.'}
        actions={[
          { label: BOOKING_CTA_LABEL, href: bookingHref(), variant: 'primary' },
          { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
