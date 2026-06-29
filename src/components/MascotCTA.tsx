import Image from 'next/image';
import Link from 'next/link';
import { CONTACT_INFO } from '@/constants/contact';

interface Action {
  label: string;
  href: string;
  isPhone?: boolean;
  isEmail?: boolean;
  variant?: 'primary' | 'secondary';
}

interface MascotCTAProps {
  tag?: string;
  title: string;
  subtitle?: string;
  actions: Action[];
}

export default function MascotCTA({ tag, title, subtitle, actions }: MascotCTAProps) {
  return (
    <section className="cta-band py-16 lg:py-24 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* Maskot */}
        <div className="flex-shrink-0 hidden lg:flex items-center justify-center">
          <Image
            src="/pictures_web/mascot_pointing.png"
            alt="Maskot VMK Pneuservis"
            width={320}
            height={350}
            className="rounded-3xl"
            style={{ filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.45))', width: 'auto' }}
          />
        </div>

        {/* Obsah */}
        <div className="flex-1 text-center lg:text-left">
          {tag && (
            <p className="section-tag lg:justify-start justify-center mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {tag}
            </p>
          )}
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg mb-8 opacity-70 max-w-xl lg:mx-0 mx-auto">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-start justify-center">
            {actions.map((action) => {
              const href = action.isPhone
                ? `tel:${CONTACT_INFO.phone.raw}`
                : action.isEmail
                ? `mailto:${CONTACT_INFO.email.raw}`
                : action.href;

              const cls = action.variant === 'secondary' ? 'btn-tech-secondary' : 'btn-tech-primary';
              const style = action.variant === 'secondary'
                ? { color: '#f0ede6', borderColor: 'rgba(255,255,255,0.3)' }
                : undefined;

              if (action.href.startsWith('/')) {
                return (
                  <Link key={action.label} href={action.href} className={cls} style={style}>
                    {action.label}
                  </Link>
                );
              }
              return (
                <a key={action.label} href={href} className={cls} style={style}>
                  {action.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
