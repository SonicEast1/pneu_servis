'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Loading, PageHeader, Segmented } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';
import type { Service } from '@/constants/services';

type Visibility = 'visible' | 'unavailable' | 'hidden';

const VISIBILITY = [
  { value: 'visible' as const, label: 'Na webu' },
  { value: 'unavailable' as const, label: 'Dočasně nedostupná' },
  { value: 'hidden' as const, label: 'Skrytá' },
];

function visibilityOf(service: Service): Visibility {
  if (!service.aktivni) return 'hidden';
  return service.nedostupna ? 'unavailable' : 'visible';
}

const EMPTY: Service = {
  id: '',
  nazev: '',
  popis: '',
  ikona: '🔧',
  cenaOsobni: '',
  cenaSUV: '',
  features: [],
  kategorie: '',
  aktivni: true,
  nedostupna: false,
  poradi: 0,
};

function ServiceForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: Service;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [features, setFeatures] = useState(initial.features.join('\n'));
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<Service>) => setForm((current) => ({ ...current, ...patch }));

  const save = async () => {
    setSaving(true);
    try {
      await api('/api/sluzby', {
        method: 'POST',
        json: { ...form, features: features.split('\n').map((line) => line.trim()).filter(Boolean) },
      });
      toast({ text: `Služba „${form.nazev}" uložena.`, tone: 'ok', link: { href: '/sluzby', label: 'Zobrazit' } });
      onSaved();
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-form">
      <div className="admin-form-grid">
        <label className="admin-field admin-field-icon">
          <span>Ikona</span>
          <input className="form-input" value={form.ikona} maxLength={8} onChange={(e) => set({ ikona: e.target.value })} />
        </label>
        <label className="admin-field admin-field-wide">
          <span>Název *</span>
          <input className="form-input" value={form.nazev} maxLength={80} onChange={(e) => set({ nazev: e.target.value })} required />
        </label>
        <label className="admin-field admin-field-full">
          <span>Popis</span>
          <textarea className="form-input" rows={3} value={form.popis} maxLength={400} onChange={(e) => set({ popis: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Cena – osobní auto</span>
          <input className="form-input" placeholder="např. 400 Kč" value={form.cenaOsobni} maxLength={40} onChange={(e) => set({ cenaOsobni: e.target.value })} />
        </label>
        <label className="admin-field">
          <span>Cena – SUV / dodávka</span>
          <input className="form-input" placeholder="např. 600 Kč" value={form.cenaSUV} maxLength={40} onChange={(e) => set({ cenaSUV: e.target.value })} />
        </label>
        <label className="admin-field admin-field-full">
          <span>Body se zaškrtnutím (každý na nový řádek, max. 8)</span>
          <textarea className="form-input" rows={4} value={features} onChange={(e) => setFeatures(e.target.value)} />
        </label>
        <div className="admin-field admin-field-full">
          <span>Zobrazení</span>
          <Segmented
            label="Zobrazení služby"
            value={visibilityOf(form)}
            options={VISIBILITY}
            onChange={(value) => set({ aktivni: value !== 'hidden', nedostupna: value === 'unavailable' })}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button type="button" className="btn-tech-secondary btn-compact" onClick={onCancel} disabled={saving}>
          Zrušit
        </button>
        <button type="button" className="btn-tech-primary btn-compact" onClick={save} disabled={saving || !form.nazev.trim()}>
          {saving ? 'Ukládám…' : 'Uložit službu'}
        </button>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const toast = useToast();
  const [services, setServices] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(() => {
    api<{ services: Service[] }>('/api/sluzby?all=1')
      .then((data) => setServices(data.services))
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [toast]);

  useEffect(load, [load]);

  const move = async (index: number, delta: number) => {
    if (!services) return;
    const next = [...services];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    setServices(next);
    try {
      await api('/api/sluzby', { method: 'PATCH', json: { order: next.map((service) => service.id) } });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
      load();
    }
  };

  const remove = async (service: Service) => {
    if (!window.confirm(`Opravdu smazat službu „${service.nazev}"? Tohle nejde vrátit.`)) return;
    try {
      await api(`/api/sluzby?id=${encodeURIComponent(service.id)}`, { method: 'DELETE' });
      toast({ text: 'Služba smazána.', tone: 'ok' });
      load();
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  const done = () => {
    setEditing(null);
    load();
  };

  if (!services) return <Loading />;

  return (
    <>
      <PageHeader
        title="Služby"
        description="Karty na stránce Služby a výběr služby v rezervaci. Pořadí změníte šipkami."
        action={
          <button type="button" className="btn-tech-primary btn-compact" onClick={() => setEditing('new')} disabled={editing === 'new'}>
            + Nová služba
          </button>
        }
      />

      {editing === 'new' && (
        <section className="admin-card mb-4">
          <h2 className="font-display font-bold text-theme mb-3">Nová služba</h2>
          <ServiceForm initial={EMPTY} onSaved={done} onCancel={() => setEditing(null)} />
        </section>
      )}

      <ul className="admin-list">
        {services.map((service, index) => {
          const visibility = visibilityOf(service);
          return (
            <li key={service.id} className="admin-card admin-list-item" data-muted={visibility === 'hidden'}>
              <div className="admin-list-row">
                <span className="admin-list-icon" aria-hidden="true">{service.ikona}</span>
                <div className="admin-list-main">
                  <span className="font-display font-semibold text-theme">{service.nazev}</span>
                  <span className="text-theme-muted text-xs">
                    {[service.cenaOsobni, service.kategorie].filter(Boolean).join(' · ')}
                  </span>
                </div>
                <span className="admin-pill" data-tone={visibility}>
                  {VISIBILITY.find((item) => item.value === visibility)?.label}
                </span>
                <div className="admin-list-actions">
                  <button type="button" className="admin-icon-button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Posunout výš">↑</button>
                  <button type="button" className="admin-icon-button" onClick={() => move(index, 1)} disabled={index === services.length - 1} aria-label="Posunout níž">↓</button>
                  <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setEditing(editing === service.id ? null : service.id)}>
                    {editing === service.id ? 'Zavřít' : 'Upravit'}
                  </button>
                  <button type="button" className="admin-icon-button is-danger" onClick={() => remove(service)} aria-label={`Smazat ${service.nazev}`}>×</button>
                </div>
              </div>
              {editing === service.id && (
                <ServiceForm initial={service} onSaved={done} onCancel={() => setEditing(null)} />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
