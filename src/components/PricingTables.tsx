'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import {
  ADDITIONAL_SERVICES,
  formatPrice,
  SERVICE_PACKAGES,
  SIZE_COLUMNS,
  SUPPLEMENTARY_SERVICES,
  type SizedPriceRow,
  type SizeKey,
} from '@/constants/pricing';

type SizeColumn = (typeof SIZE_COLUMNS)[number];

/* ─── Sdílený stav vybraného rozměru (napříč legendou i tabulkami) ─── */
const SizeFocusContext = createContext<{
  active: SizeKey | null;
  toggle: (key: SizeKey) => void;
} | null>(null);

export function SizeFocusProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SizeKey | null>(null);
  const toggle = useCallback((key: SizeKey) => {
    setActive((prev) => (prev === key ? null : key));
  }, []);
  const value = useMemo(() => ({ active, toggle }), [active, toggle]);
  return <SizeFocusContext.Provider value={value}>{children}</SizeFocusContext.Provider>;
}

function useSizeFocus() {
  const ctx = useContext(SizeFocusContext);
  return ctx ?? { active: null, toggle: () => {} };
}

function sizeChipLabel(key: string, label: string): ReactNode {
  if (key === 'van') return <>VAN/SUV<br />15&Prime;–17&Prime;</>;
  if (key === 'suv') return <>SUV/Offroad<br />18&Prime;+</>;
  return label;
}

function SizeInfoTooltip({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="price-chip-tooltip" role="tooltip">
      <span className="price-chip-tooltip-title">{label}</span>
      {hint}
    </span>
  );
}

function SizePriceChip({ col, price }: { col: SizeColumn; price: number }) {
  const { active, toggle } = useSizeFocus();
  const isActive = active === col.key;
  const isDimmed = active !== null && !isActive;
  const className = [
    'price-chip',
    isActive && 'price-chip-active',
    isDimmed && 'price-chip-dimmed',
  ].filter(Boolean).join(' ');

  return (
    <button type="button" className={className} onClick={() => toggle(col.key)} aria-pressed={isActive}>
      <span className="price-chip-label">{sizeChipLabel(col.key, col.label)}</span>
      <span className="price-chip-price">{formatPrice(price)}</span>
      <SizeInfoTooltip label={col.label} hint={col.hint} />
    </button>
  );
}

function SizedPriceCards({ rows }: { rows: SizedPriceRow[] }) {
  return (
    <div className="price-card-grid">
      {rows.map((row) => (
        <div key={row.name} className="tech-panel price-card">
          <h3 className="price-card-name">{row.name}</h3>
          {row.description && <p className="price-card-desc">{row.description}</p>}
          <div className="price-chip-grid">
            {SIZE_COLUMNS.map((col) => (
              <SizePriceChip key={col.key} col={col} price={row.prices[col.key]} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ServicePackagesTable() {
  return <SizedPriceCards rows={SERVICE_PACKAGES} />;
}

export function AdditionalServicesTable() {
  return <SizedPriceCards rows={ADDITIONAL_SERVICES} />;
}

export function SupplementaryServicesTable() {
  return (
    <div className="price-card-grid">
      {SUPPLEMENTARY_SERVICES.map((row) => (
        <div key={row.name} className="tech-panel price-card price-card-simple">
          <div className="price-card-simple-row">
            <div>
              <h3 className="price-card-name">{row.name}</h3>
              <p className="price-card-desc price-card-desc-inline">
                {row.unit}{row.note ? ` · ${row.note}` : ''}
              </p>
            </div>
            <span className="price-card-simple-price">{formatPrice(row.price)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SizeCategoryChips() {
  const { active, toggle } = useSizeFocus();
  return (
    <div className="size-category-grid">
      {SIZE_COLUMNS.map((col) => {
        const isActive = active === col.key;
        return (
          <button
            key={col.key}
            type="button"
            className={`size-category-chip${isActive ? ' size-category-chip-active' : ''}`}
            onClick={() => toggle(col.key)}
            aria-pressed={isActive}
          >
            {col.label}
            <SizeInfoTooltip label={col.label} hint={col.hint} />
          </button>
        );
      })}
    </div>
  );
}
