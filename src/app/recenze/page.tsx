import Image from 'next/image';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';
import MascotCTA from '@/components/MascotCTA';

export const metadata: Metadata = {
  title: 'Recenze',
  description: 'Hodnocení zákazníků pneuservisu VMK Jaroměř na Firmy.cz / Seznam.cz.',
};

export default function ReviewsPage() {
  const s = CONTACT_INFO.seznam;

  return (
    <>
      <TechBackground>
        {/* Hero */}
        <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
            <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="section-tag justify-center mb-4 animate-fadeInUp">Recenze</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
              Co říkají <span className="gradient-tech">zákazníci</span>
            </h1>
            <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
              Přečtěte si, co o nás říkají naši spokojení zákazníci.
            </p>
          </div>
        </section>

        {/* Hodnocení ze Seznam.cz */}
        <section className="py-16 lg:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Záhlaví */}
            <div className="text-center mb-10">
              <p className="section-tag justify-center mb-3">Ověřené recenze</p>
              <h2 className="section-title font-display text-2xl sm:text-3xl font-bold">
                Hodnocení ze <span className="gradient-tech">Seznam.cz</span>
              </h2>
            </div>

            {/* Widget s recenzemi */}
            <div className="hud-frame overflow-hidden animate-fadeInUp">
              <iframe
                src={s.widgetUrl}
                width="100%"
                height="420"
                style={{ border: 'none', minHeight: '420px' }}
                loading="lazy"
                title="Recenze ze Seznam.cz / Firmy.cz"
                className="w-full"
              />
            </div>

            {/* CTA – přidat hodnocení */}
            <div className="text-center mt-6">
              <a
                href={s.addRatingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tech-secondary"
              >
                Přidat hodnocení na Seznam.cz →
              </a>
            </div>

          </div>
        </section>
      </TechBackground>

      <MascotCTA
        tag="Vaše zkušenost"
        title="Byli jste u nás? Ohodnoťte nás!"
        subtitle="Vaše hodnocení nám pomáhá zlepšovat se a pomáhá dalším zákazníkům se rozhodnout."
        actions={[
          { label: 'Přidat hodnocení na Seznam.cz', href: CONTACT_INFO.seznam.addRatingUrl, variant: 'primary' },
          { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'secondary' },
        ]}
      />
    </>
  );
}
