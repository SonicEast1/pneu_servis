'use client';

import { useEffect, useState } from 'react';
import { api, Loading, PageHeader, SaveBar } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';
import {
  SIZE_COLUMNS,
  type Pricing,
  type SizedPriceRow,
  type SupplementaryPriceRow,
} from '@/constants/pricing';

type SizedKey = 'packages' | 'additional';

const SIZED_SECTIONS: { key: SizedKey; title: string; hint: string }[] = [
  { key: 'packages', title: 'Servisní pakety', hint: 'Ceny za 1 kolo podle rozměru ráfku.' },
  { key: 'additional', title: 'Další služby', hint: 'Jednotlivé úkony, také za 1 kolo podle rozměru.' },
];

const emptySized = (): SizedPriceRow => ({
  name: '',
  description: '',
  prices: Object.fromEntries(SIZE_COLUMNS.map((col) => [col.key, 0])) as SizedPriceRow['prices'],
});

type SimpleKey = 'supplementary' | 'storage';

const SIMPLE_SECTIONS: { key: SimpleKey; title: string; hint: string; unit: string }[] = [
  { key: 'supplementary', title: 'Ostatní doplňkové služby', hint: 'Jedna cena, např. oprava pneu nebo TPMS.', unit: '1 ks' },
  { key: 'storage', title: 'Uskladnění', hint: 'Cena za uskladnění sady pneumatik na jednu sezónu.', unit: '1 sezona, 1 sada' },
];

const emptySupplementary = (unit = '1 ks'): SupplementaryPriceRow => ({ name: '', unit, note: '', price: 0 });

function move<T>(rows: T[], index: number, delta: number): T[] {
  const next = [...rows];
  const [item] = next.splice(index, 1);
  next.splice(index + delta, 0, item);
  return next;
}

function RowTools({
  index,
  count,
  onMove,
  onRemove,
  name,
}: {
  index: number;
  count: number;
  onMove: (delta: number) => void;
  onRemove: () => void;
  name: string;
}) {
  return (
    <div className="admin-list-actions">
      <button type="button" className="admin-icon-button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Posunout výš">↑</button>
      <button type="button" className="admin-icon-button" onClick={() => onMove(1)} disabled={index === count - 1} aria-label="Posunout níž">↓</button>
      <button
        type="button"
        className="admin-icon-button is-danger"
        onClick={() => window.confirm(`Odebrat řádek „${name || 'bez názvu'}"?`) && onRemove()}
        aria-label="Odebrat řádek"
      >
        ×
      </button>
    </div>
  );
}

export default function AdminPricingPage() {
  const toast = useToast();
  const [saved, setSaved] = useState<Pricing | null>(null);
  const [pricing, setPricing] = useState<Pricing | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api<{ pricing: Pricing }>('/api/cenik')
      .then((data) => {
        setSaved(data.pricing);
        setPricing(data.pricing);
      })
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [toast]);

  if (!pricing || !saved) return <Loading />;

  const dirty = JSON.stringify(pricing) !== JSON.stringify(saved);

  const setMeta = (patch: Partial<Pricing['meta']>) => setPricing({ ...pricing, meta: { ...pricing.meta, ...patch } });
  const setSized = (key: SizedKey, rows: SizedPriceRow[]) => setPricing({ ...pricing, [key]: rows });
  const setSimple = (key: SimpleKey, rows: SupplementaryPriceRow[]) => setPricing({ ...pricing, [key]: rows });

  const updateSized = (key: SizedKey, index: number, patch: Partial<SizedPriceRow>) => {
    setSized(key, pricing[key].map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    setSaving(true);
    try {
      const data = await api<{ pricing: Pricing }>('/api/cenik', { method: 'PUT', json: { pricing } });
      setSaved(data.pricing);
      setPricing(data.pricing);
      toast({ text: 'Ceník uložen. Na webu platí hned.', tone: 'ok', link: { href: '/cenik', label: 'Zobrazit' } });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Ceník"
        description="Ceny na stránce Ceník a v odpovědích chatu. Částky v Kč včetně DPH, bez mezer a bez „Kč“."
      />

      <section className="admin-card mb-6">
        <h2 className="admin-h2">Obecné</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Platnost od</span>
            <input className="form-input" value={pricing.meta.validFrom} onChange={(e) => setMeta({ validFrom: e.target.value })} placeholder="např. 1. 10. 2026" />
          </label>
          <label className="admin-field">
            <span>Poznámka k DPH</span>
            <input className="form-input" value={pricing.meta.vatNote} onChange={(e) => setMeta({ vatNote: e.target.value })} />
          </label>
          <label className="admin-field admin-field-full">
            <span>Poznámka pod nadpisy tabulek</span>
            <input className="form-input" value={pricing.meta.perUnitNote} onChange={(e) => setMeta({ perUnitNote: e.target.value })} />
          </label>
        </div>
      </section>

      {SIZED_SECTIONS.map((section) => (
        <section key={section.key} className="admin-card mb-6">
          <div className="admin-section-head">
            <div>
              <h2>{section.title}</h2>
              <p className="text-theme-secondary text-sm">{section.hint}</p>
            </div>
            <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setSized(section.key, [...pricing[section.key], emptySized()])}>
              + Přidat řádek
            </button>
          </div>

          <ul className="admin-price-rows">
            {pricing[section.key].map((row, index) => (
              <li key={index} className="admin-price-row">
                <div className="admin-price-row-head">
                  <input
                    className="form-input admin-price-name"
                    value={row.name}
                    placeholder="Název, např. Set 1 - KOMPLETNÍ PŘEZUTÍ"
                    onChange={(e) => updateSized(section.key, index, { name: e.target.value })}
                    aria-label="Název"
                  />
                  <RowTools
                    index={index}
                    count={pricing[section.key].length}
                    name={row.name}
                    onMove={(delta) => setSized(section.key, move(pricing[section.key], index, delta))}
                    onRemove={() => setSized(section.key, pricing[section.key].filter((_, i) => i !== index))}
                  />
                </div>
                <input
                  className="form-input mb-3"
                  value={row.description ?? ''}
                  placeholder="Co je v ceně (nepovinné)"
                  onChange={(e) => updateSized(section.key, index, { description: e.target.value })}
                  aria-label="Popis"
                />
                <div className="admin-price-grid">
                  {SIZE_COLUMNS.map((col) => (
                    <label key={col.key} className="admin-price-cell">
                      <span>{col.key === 'van' ? 'VAN 15–17"' : col.key === 'suv' ? 'SUV 18"+' : col.label}</span>
                      <input
                        className="form-input"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        step={5}
                        value={row.prices[col.key]}
                        onChange={(e) => updateSized(section.key, index, {
                          prices: { ...row.prices, [col.key]: Number(e.target.value) },
                        })}
                      />
                    </label>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {SIMPLE_SECTIONS.map((section) => (
        <section key={section.key} className="admin-card mb-6">
          <div className="admin-section-head">
            <div>
              <h2>{section.title}</h2>
              <p className="text-theme-secondary text-sm">{section.hint}</p>
            </div>
            <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setSimple(section.key, [...pricing[section.key], emptySupplementary(section.unit)])}>
              + Přidat řádek
            </button>
          </div>

          <ul className="admin-price-rows">
            {pricing[section.key].map((row, index) => {
              const rows = pricing[section.key];
              const update = (patch: Partial<SupplementaryPriceRow>) =>
                setSimple(section.key, rows.map((item, i) => (i === index ? { ...item, ...patch } : item)));
              return (
                <li key={index} className="admin-price-row admin-supp-row">
                  <input className="form-input" value={row.name} placeholder="Název" onChange={(e) => update({ name: e.target.value })} aria-label="Název" />
                  <input className="form-input" value={row.unit} placeholder={section.unit} onChange={(e) => update({ unit: e.target.value })} aria-label="Jednotka" />
                  <input className="form-input" value={row.note ?? ''} placeholder="Poznámka (nepovinné)" onChange={(e) => update({ note: e.target.value })} aria-label="Poznámka" />
                  <label className="admin-price-cell">
                    <span>Kč</span>
                    <input className="form-input" type="number" inputMode="numeric" min={0} value={row.price} onChange={(e) => update({ price: Number(e.target.value) })} />
                  </label>
                  <RowTools
                    index={index}
                    count={rows.length}
                    name={row.name}
                    onMove={(delta) => setSimple(section.key, move(rows, index, delta))}
                    onRemove={() => setSimple(section.key, rows.filter((_, i) => i !== index))}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <SaveBar dirty={dirty} saving={saving} onSave={save} onReset={() => setPricing(saved)} />
    </>
  );
}
