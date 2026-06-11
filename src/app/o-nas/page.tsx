import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';

export const metadata: Metadata = {
  title: 'O nás',
  description: 'Seznamte se s PneuservisVMK - náš příběh, zkušenosti a hodnoty, které nás vedou.',
};

const stats = [
  { value: '15+', label: 'Let zkušeností' },
  { value: '10K+', label: 'Spokojených zákazníků' },
  { value: '25K+', label: 'Vyměněných pneumatik' },
  { value: '4.9★', label: 'Hodnocení' },
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
              <div className="hud-frame p-2 overflow-hidden">
                <img
                  src="/pictures_web/VMKLogo.png"
                  alt="PneuservisVMK"
                  className="w-full h-full object-cover rounded-sm"
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
      <section className="cta-band py-20 lg:py-28">
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <p className="section-tag justify-center mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Přidejte se k nám
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Připojte se k tisícům spokojených zákazníků
          </h2>
          <p className="text-lg mb-10 opacity-75">
            Rezervujte termín online nebo nám zavolejte — rádi se postaráme o vaše kola.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rezervace" className="btn-tech-primary">
              Rezervovat termín
            </Link>
            <a
              href={`tel:${CONTACT_INFO.phone.raw}`}
              className="btn-tech-secondary"
              style={{ color: '#f0ede6', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Zavolat nyní
            </a>
          </div>
        </div>
      </section>
    </TechBackground>
  );
}
