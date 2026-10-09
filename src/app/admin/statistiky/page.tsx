'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import TechBackground from '@/components/TechBackground';
import type { AnalyticsSummary, DailyPoint, RankedItem } from '@/lib/analyticsTypes';

const RANGES = [
  { days: 1, label: 'Dnes', hint: 'Jen dnešní den' },
  { days: 7, label: '7 dní', hint: 'Posledních 7 dní' },
  { days: 30, label: '30 dní', hint: 'Posledních 30 dní' },
  { days: 0, label: 'Celkem', hint: 'Od spuštění statistik' },
] as const;

const ADMIN_LINKS = [
  { href: '/admin/statistiky', label: 'Statistiky' },
  { href: '/admin/rezervace', label: 'Rezervace' },
  { href: '/admin/sluzby', label: 'Služby' },
  { href: '/admin/recenze', label: 'Recenze' },
  { href: '/admin/oteviraci-doba', label: 'Otevírací doba' },
  { href: '/admin/upload', label: 'Galerie' },
];

const CATEGORY_LABEL: Record<string, string> = {
  card: 'Karta',
  cta: 'Tlačítko',
  nav: 'Menu',
  click: 'Klik',
};

function formatDay(iso: string): string {
  const [, month, day] = iso.split('-');
  return `${Number(day)}.${Number(month)}.`;
}

const WEEKDAYS = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];

function formatDayLong(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day, 12)).getUTCDay()];
  return `${weekday} ${day}. ${month}.`;
}

function formatRange(from: string, to: string): string {
  if (!from || !to) return '';
  if (from === to) return formatDay(from);
  return `${formatDay(from)} – ${formatDay(to)}`;
}

function Tip({ title, lines }: { title: string; lines: string[] }) {
  return (
    <span className="stats-tip" role="tooltip">
      <span className="stats-tip-title">{title}</span>
      {lines.map((line) => (
        <span key={line} className="stats-tip-line">{line}</span>
      ))}
    </span>
  );
}

function RankList({ items, empty, unit }: { items: RankedItem[]; empty: string; unit: string }) {
  const max = items[0]?.count ?? 0;
  if (items.length === 0) {
    return <p className="text-theme-muted text-sm py-2">{empty}</p>;
  }

  return (
    <div className="stats-rank">
      {items.map((item, index) => {
        const width = max ? Math.max(6, (item.count / max) * 100) : 0;
        const category = item.category ? CATEGORY_LABEL[item.category] : null;
        return (
          <div key={`${item.category ?? 'x'}-${item.path ?? item.label}`} className="stats-rank-row">
            <span className="stats-rank-index">{String(index + 1).padStart(2, '0')}</span>
            <span className="stats-rank-label">{item.label}</span>
            {category && <span className="stats-cat">{category}</span>}
            <span className="stats-rank-count">{item.count}</span>
            <div className="stats-bar">
              <span style={{ width: `${width}%` }} />
            </div>
            <Tip
              title={item.label}
              lines={[
                `${item.count}× ${unit}`,
                category ? `Typ: ${category}` : 'Stránka webu',
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}

function DayChart({ points }: { points: DailyPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.pageviews));
  const dense = points.length > 14;
  if (points.length === 0) {
    return <p className="text-theme-muted text-sm">Zatím žádný průběh.</p>;
  }

  return (
    <div className={`stats-chart ${dense ? 'stats-chart-dense' : ''}`} role="img" aria-label="Návštěvy po dnech">
      {points.map((point, index) => {
        const empty = point.pageviews === 0;
        const showLabel = !dense || index === 0 || index === points.length - 1 || index % 5 === 0;
        const height = empty ? 0 : Math.max(8, (point.pageviews / max) * 100);
        return (
          <div
            key={point.date}
            className={`stats-chart-item ${empty ? 'is-empty' : ''}`}
          >
            <div className="stats-chart-track">
              <div className="stats-chart-col" style={{ height: `${height}%` }} />
            </div>
            <span className={showLabel ? undefined : 'is-faded'}>{formatDay(point.date)}</span>
            <Tip
              title={formatDayLong(point.date)}
              lines={[
                `${point.pageviews} zobrazení`,
                `${point.sessions} návštěv`,
                `${point.clicks} kliknutí`,
              ]}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function AdminStatsPage() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (range: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/analytics?days=${range}`);
      if (!response.ok) throw new Error('load failed');
      const json = (await response.json()) as AnalyticsSummary;
      setData(json);
    } catch {
      setError('Nepodařilo se načíst statistiky.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(days);
  }, [days, load]);

  const totals = data?.totals;
  const hasData = Boolean(totals && (totals.pageviews || totals.clicks || totals.sessions));
  const rangeLabel = useMemo(
    () => (data ? formatRange(data.from, data.to) : ''),
    [data],
  );
  const actionClicks = useMemo(
    () => (data?.clicks ?? []).filter((item) => item.category !== 'card'),
    [data],
  );

  return (
    <TechBackground>
      <section className="relative border-b border-theme py-10 lg:py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-tag mb-3">Admin</p>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-theme mb-2">
            Statistiky <span className="gradient-tech">webu</span>
          </h1>
          <p className="text-theme-secondary max-w-2xl">
            Návštěvy, stránky a kliknutí. Bez IP adres, jen pro vás.
          </p>
        </div>
      </section>

      <section className="border-b border-theme bg-surface-alt py-4 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <nav className="flex flex-wrap gap-1" aria-label="Admin">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link-tech ${link.href === '/admin/statistiky' ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Období">
            {RANGES.map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => setDays(range.days)}
                className={`nav-link-tech stats-filter ${days === range.days ? 'active' : ''}`}
              >
                {range.label}
                <Tip title={range.label} lines={[range.hint]} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {loading && !data && (
        <section className="py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--accent)] mx-auto mb-4" />
            <p className="text-theme-muted">Načítám statistiky...</p>
          </div>
        </section>
      )}

      {error && !data && (
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tech-panel stats-panel">
            <p className="section-tag">Chyba</p>
            <h2 className="section-title text-2xl font-bold mb-2">Nepodařilo se načíst data</h2>
            <p className="text-theme-secondary">{error}</p>
          </div>
        </section>
      )}

      {data && (
        <div className={loading ? 'stats-refreshing' : undefined}>
          <section className="py-8 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-5">
                <p className="section-tag">Přehled</p>
                <h2 className="section-title text-2xl sm:text-3xl font-bold">
                  Čísla za {rangeLabel || 'období'}
                </h2>
              </div>

              {!hasData && (
                <div className="tech-panel stats-panel mb-5">
                  <p className="section-tag">Zatím tiše</p>
                  <p className="text-theme-secondary">
                    Jakmile někdo otevře web, objeví se tady zobrazení, návštěvy a kliknutí.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <article className="tech-panel stats-metric">
                  <p className="section-tag">Zobrazení</p>
                  <div className="stats-metric-value">{totals?.pageviews ?? 0}</div>
                  <p className="stats-metric-hint">Načtení stránek</p>
                  <Tip title="Zobrazení" lines={['Kolikrát se načetla jakákoli stránka webu.', 'Jedna návštěva může mít víc zobrazení.']} />
                </article>
                <article className="tech-panel stats-metric">
                  <p className="section-tag">Návštěvy</p>
                  <div className="stats-metric-value">{totals?.sessions ?? 0}</div>
                  <p className="stats-metric-hint">Otevření webu</p>
                  <Tip title="Návštěvy" lines={['Kolik lidí web otevřelo v novém okně nebo záložce.']} />
                </article>
                <article className="tech-panel stats-metric">
                  <p className="section-tag">Kliknutí</p>
                  <div className="stats-metric-value">{totals?.clicks ?? 0}</div>
                  <p className="stats-metric-hint">Karty a tlačítka</p>
                  <Tip title="Kliknutí" lines={['Karty služeb a ceníku, menu, telefon a e-mail.']} />
                </article>
                <article className="tech-panel stats-metric">
                  <p className="section-tag">Top stránka</p>
                  <div className="stats-metric-value">{data.pages[0]?.count ?? 0}</div>
                  <p className="stats-metric-hint">{data.pages[0]?.label ?? 'Zatím žádná'}</p>
                  <Tip
                    title="Nejsilnější stránka"
                    lines={data.pages[0] ? [`${data.pages[0].label}: ${data.pages[0].count} zobrazení`] : ['Zatím bez dat']}
                  />
                </article>
              </div>
            </div>
          </section>

          <section className="border-y border-theme bg-surface-alt py-8 lg:py-10 transition-colors duration-400">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-4">
                <p className="section-tag">Průběh</p>
                <h2 className="section-title text-2xl sm:text-3xl font-bold">Návštěvy po dnech</h2>
              </div>
              <div className="tech-panel stats-panel">
                <DayChart points={data.daily} />
              </div>
            </div>
          </section>

          <section className="py-8 lg:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                <div className="tech-panel stats-panel">
                  <p className="section-tag">Stránky</p>
                  <h2 className="section-title text-xl font-bold mb-3">Kde se dívají</h2>
                  <RankList items={data.pages} empty="Zatím žádná zobrazení." unit="zobrazení" />
                </div>
                <div className="tech-panel stats-panel">
                  <p className="section-tag">Karty</p>
                  <h2 className="section-title text-xl font-bold mb-3">Na co klikají</h2>
                  <RankList items={data.cards} empty="Zatím nikdo na karty neklikl." unit="kliknutí" />
                </div>
                <div className="tech-panel stats-panel">
                  <p className="section-tag">Tlačítka</p>
                  <h2 className="section-title text-xl font-bold mb-3">Telefon a menu</h2>
                  <RankList items={actionClicks} empty="Zatím žádná kliknutí na menu nebo telefon." unit="kliknutí" />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </TechBackground>
  );
}
