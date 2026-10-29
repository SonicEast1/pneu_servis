import Link from 'next/link';
import { adminCounts, getOpeningHours, getSpecialDays } from '@/lib/content';
import { getOpenStatus } from '@/lib/openingHours';
import { PageHeader } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Přehled' };

export default function AdminOverviewPage() {
  const counts = adminCounts();
  const status = getOpenStatus(getOpeningHours(), new Date(), getSpecialDays());

  const cards = [
    {
      href: '/admin/rezervace',
      label: 'Nové rezervace',
      value: counts.newReservations,
      hint: counts.newReservations > 0 ? 'Čekají na potvrzení' : 'Nic nového',
      highlight: counts.newReservations > 0,
    },
    {
      href: '/admin/rezervace',
      label: 'Potvrzené termíny',
      value: counts.upcomingReservations,
      hint: 'Od dneška dál',
      highlight: false,
    },
    {
      href: '/admin/recenze',
      label: 'Recenze ke schválení',
      value: counts.pendingReviews,
      hint: counts.pendingReviews > 0 ? 'Zatím nejsou na webu' : 'Vše vyřízeno',
      highlight: counts.pendingReviews > 0,
    },
    {
      href: '/admin/galerie',
      label: 'Fotky v galerii',
      value: counts.galleryImages,
      hint: 'Viditelné na webu',
      highlight: false,
    },
  ];

  const shortcuts = [
    { href: '/admin/oteviraci-doba', title: 'Změnit otevírací dobu', text: 'Běžný týden, svátky a dovolená.' },
    { href: '/admin/galerie', title: 'Přidat fotky', text: 'Nahrajte fotky z telefonu nebo počítače.' },
    { href: '/admin/cenik', title: 'Upravit ceny', text: 'Ceny v tabulkách na stránce Ceník.' },
    { href: '/admin/sluzby', title: 'Upravit služby', text: 'Popisy, ikony a co je dočasně nedostupné.' },
  ];

  return (
    <>
      <PageHeader title="Přehled" description="Co je nového a rychlé odkazy na nejčastější úpravy." />

      <section className="admin-card admin-status mb-6">
        <span className={`admin-dot ${status.isOpen ? 'is-open' : ''}`} aria-hidden="true" />
        <div>
          <p className="font-display font-bold text-theme">
            Na webu teď: {status.label}
          </p>
          <p className="text-theme-secondary text-sm">
            {status.detail} · dnešní doba: {status.todayHours}
          </p>
        </div>
        <Link href="/admin/oteviraci-doba" className="btn-tech-secondary btn-compact ml-auto">
          Upravit
        </Link>
      </section>

      <div className="admin-stats mb-8">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="admin-card admin-stat" data-highlight={card.highlight}>
            <span className="admin-stat-label">{card.label}</span>
            <span className="admin-stat-value">{card.value}</span>
            <span className="text-theme-muted text-xs">{card.hint}</span>
          </Link>
        ))}
      </div>

      <h2 className="font-display text-lg font-bold text-theme mb-3">Rychlé úpravy</h2>
      <div className="admin-shortcuts">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.href} href={shortcut.href} className="admin-card admin-shortcut">
            <span className="font-display font-semibold text-theme">
              {shortcut.title} <span className="btn-arrow" aria-hidden="true">→</span>
            </span>
            <span className="text-theme-secondary text-sm">{shortcut.text}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
