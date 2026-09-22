import Image from 'next/image';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';
import MascotCTA from '@/components/MascotCTA';
import { bookingHref, BOOKING_CTA_LABEL, RESERVATIONS_ENABLED } from '@/constants/reservation';

export const metadata: Metadata = {
  title: 'Fotogalerie',
  description: 'Fotogalerie PneuservisVMK Jaroměř. Provozovna, vybavení a práce pneuservisu na Náchodské 118.',
  keywords: ['fotogalerie pneuservis', 'pneuservis jaroměř', 'provozovna', 'vybavení'],
  alternates: { canonical: '/galerie' },
};

export default function GalleryPage() {
  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Fotogalerie</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Naše <span className="gradient-tech">práce</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Ukázky naší práce a vybavení provozovny — již brzy.
          </p>
        </div>
      </section>

      {/* Under construction */}
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="construction-panel animate-fadeInUp">
            <div className="construction-icon">📷</div>
            <span className="tech-badge tech-badge-live mb-5">Připravujeme</span>
            <h2 className="section-title font-display text-2xl sm:text-3xl font-bold mb-3">
              Fotogalerie se připravuje
            </h2>
            <p className="text-theme-secondary text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-7">
              Pracujeme na tom, abychom vám ukázali naši provozovnu, vybavení i práci na kolech.
              Fotky mezitím najdete na našich sociálních sítích.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={CONTACT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tech-secondary"
              >
                Facebook →
              </a>
              <a
                href={CONTACT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tech-secondary"
              >
                Instagram →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <MascotCTA
        title="Přesvědčili jsme vás?"
        subtitle={RESERVATIONS_ENABLED ? 'Navštivte nás nebo si rezervujte termín online!' : 'Navštivte nás nebo nás kontaktujte pro domluvení termínu.'}
        actions={[
          { label: BOOKING_CTA_LABEL, href: bookingHref(), variant: 'primary' },
          { label: CONTACT_INFO.phone.display, href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </TechBackground>
  );
}
