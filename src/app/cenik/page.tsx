import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import MascotCTA from '@/components/MascotCTA';
import {
  AdditionalServicesTable,
  ServicePackagesTable,
  SizeCategoryChips,
  SupplementaryServicesTable,
} from '@/components/PricingTables';
import { PRICING_META } from '@/constants/pricing';
import { bookingHref, BOOKING_CTA_LABEL } from '@/constants/reservation';

export const metadata: Metadata = {
  title: 'Ceník',
  description: 'Aktuální ceník pneuservisu VMK Jaroměř. Servisní pakety, montáž, vyvážení a doplňkové služby. Ceny v Kč včetně DPH.',
  keywords: ['ceník pneuservis', 'ceny přezutí', 'vyvážení kol cena', 'montáž pneu Jaroměř'],
};

export default function CenikPage() {
  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Ceník</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Ceník <span className="gradient-tech">pneuservisu</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            {PRICING_META.vatNote} Platnost od {PRICING_META.validFrom}.
          </p>
        </div>
      </section>

      {/* Size categories — aligned with tables */}
      <section className="border-b border-theme bg-surface-alt py-8 sm:py-10 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-tag mb-4">Rozměrové kategorie</p>
          <SizeCategoryChips />
        </div>
      </section>

      {/* Servisní pakety */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="section-tag">Servisní pakety</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold mb-2">Servisní pakety</h2>
            <p className="text-theme-secondary text-sm">{PRICING_META.perUnitNote}</p>
          </div>
          <ServicePackagesTable />
        </div>
      </section>

      {/* Další služby */}
      <section className="border-t border-theme bg-surface-alt py-16 lg:py-20 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="section-tag">Další služby</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold mb-2">Další služby</h2>
            <p className="text-theme-secondary text-sm">{PRICING_META.perUnitNote}</p>
          </div>
          <AdditionalServicesTable />
        </div>
      </section>

      {/* Doplňkové služby */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="section-tag">Doplňkové služby</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold mb-2">Ostatní doplňkové služby</h2>
          </div>
          <SupplementaryServicesTable />
        </div>
      </section>

      {/* Note */}
      <section className="border-t border-theme bg-surface-alt py-10 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tech-panel max-w-3xl">
            <p className="font-mono-tech text-[0.7rem] text-tech tracking-widest uppercase mb-2">Poznámka</p>
            <p className="text-theme-secondary text-sm leading-relaxed">
              {PRICING_META.vatNote} Ceník je platný od {PRICING_META.validFrom}.
            </p>
            <Link href="/sluzby" className="inline-block mt-4 text-accent font-display font-semibold text-sm hover:underline">
              ← Přehled služeb
            </Link>
          </div>
        </div>
      </section>

      <MascotCTA
        tag="Máte dotaz k cenám?"
        title="Nejste si jistí, co vybrat?"
        subtitle="Zavolejte nám nebo nás kontaktujte — poradíme s výběrem služby i rozměru."
        actions={[
          { label: BOOKING_CTA_LABEL, href: bookingHref(), variant: 'primary' },
          { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
