import Image from 'next/image';
import type { Metadata } from 'next';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';
import MascotCTA from '@/components/MascotCTA';
import { listReviews } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Recenze',
  description: 'Recenze a hodnocení zákazníků PneuservisVMK Jaroměř na Firmy.cz. Pneuservis, přezutí a vyvážení kol.',
  keywords: ['recenze pneuservis', 'pneuservisvmk recenze', 'hodnocení pneuservis jaroměř'],
  alternates: { canonical: '/recenze' },
};

// Recenze schvaluje admin → načíst při každém zobrazení
export const dynamic = 'force-dynamic';

const dateFormat = new Intl.DateTimeFormat('cs-CZ', { month: 'long', year: 'numeric', timeZone: 'Europe/Prague' });

export default function ReviewsPage() {
  const s = CONTACT_INFO.seznam;
  const reviews = listReviews({ onlyApproved: true });

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

            <div className="tech-panel animate-fadeInUp text-center">
              <p className="font-display text-5xl font-bold text-accent mb-2">5,0</p>
              <p className="text-theme font-display font-semibold mb-1">Fantastické hodnocení na Firmy.cz</p>
              <p className="text-theme-secondary text-sm mb-6">
                Ověřené recenze zákazníků na Seznam.cz / Firmy.cz.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={s.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tech-primary"
                >
                  Zobrazit recenze na Firmy.cz <span className="btn-arrow" aria-hidden="true">→</span>
                </a>
                <a
                  href={s.addRatingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-tech-secondary"
                >
                  Přidat hodnocení
                </a>
              </div>
            </div>

          </div>
        </section>

        {reviews.length > 0 && (
          <section className="border-t border-theme bg-surface-alt py-16 lg:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <p className="section-tag">Od zákazníků</p>
                <h2 className="section-title text-3xl sm:text-4xl font-bold">Co nám napsali</h2>
              </div>
              <div className="review-grid">
                {reviews.map((review) => (
                  <figure key={review.id} className="tech-panel review-card">
                    <p className="review-stars" aria-label={`Hodnocení ${review.rating} z 5`}>
                      {'★'.repeat(review.rating)}
                      <span aria-hidden="true">{'★'.repeat(5 - review.rating)}</span>
                    </p>
                    <blockquote className="text-theme-secondary leading-relaxed">{review.text}</blockquote>
                    <figcaption className="review-author">
                      <span className="font-display font-semibold text-theme">{review.name}</span>
                      <span className="text-theme-muted text-xs">{dateFormat.format(new Date(review.createdAt))}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
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
