'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { api } from '@/components/admin/ui';
import WheelCountPicker from '@/components/WheelCountPicker';
import type { Service } from '@/constants/services';
import { BOOKING_SLOT_MINUTES, WHEEL_SIZE_OPTIONS } from '@/constants/reservation';
import { bookingSlots, pragueDate, type OpeningHour, type SpecialDay } from '@/lib/openingHours';

const EMPTY = {
  service: '',
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  car: '',
  wheelCount: '',
  wheelSize: '',
  note: '',
};

/**
 * Rychlé zadání rezervace přijaté po telefonu. Povinné je jen to, co se
 * do telefonu řekne vždy (služba, termín, jméno, telefon); uloží se rovnou
 * jako potvrzená.
 */
export default function ReservationForm({ onSaved, onCancel }: { onSaved: (date: string) => void; onCancel: () => void }) {
  const [form, setForm] = useState(EMPTY);
  const [services, setServices] = useState<Service[]>([]);
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [specials, setSpecials] = useState<SpecialDay[]>([]);
  const [taken, setTaken] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ services: Service[] }>('/api/sluzby').then((data) => setServices(data.services)).catch(() => {});
    api<{ hours: OpeningHour[]; specials: SpecialDay[] }>('/api/oteviraci-doba')
      .then((data) => {
        setHours(data.hours);
        setSpecials(data.specials);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!form.date) return;
    let cancelled = false;
    api<{ taken: string[] }>(`/api/rezervace?obsazeno=${form.date}`)
      .then((data) => !cancelled && setTaken(data.taken))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [form.date]);

  // Admin může vzít i první hodinu po otevření — návrhy od otevírací doby
  const slots = form.date && hours.length > 0 ? bookingSlots(hours, specials, form.date, BOOKING_SLOT_MINUTES) : [];
  const set = (patch: Partial<typeof EMPTY>) => setForm((current) => ({ ...current, ...patch }));
  const ready = form.service && form.date && form.time && form.name.trim() && form.phone.trim();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api('/api/rezervace', { method: 'POST', json: form });
      onSaved(form.date);
    } catch (problem) {
      setError((problem as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="admin-card mb-6">
      <h2 className="admin-h2">Nová rezervace po telefonu</h2>
      <p className="text-theme-secondary text-sm mb-4">
        Uloží se rovnou jako potvrzená. Povinné je jen označené hvězdičkou.
      </p>

      <div className="admin-form-grid">
        <label className="admin-field admin-field-full">
          <span>Služba *</span>
          <select className="form-input" value={form.service} onChange={(e) => set({ service: e.target.value })} required>
            <option value="" disabled>Vyberte službu</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>{service.nazev}</option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Datum *</span>
          <input
            type="date"
            className="form-input"
            value={form.date}
            min={pragueDate()}
            onChange={(e) => {
              setTaken([]);
              set({ date: e.target.value, time: '' });
            }}
            required
          />
        </label>

        <label className="admin-field">
          <span>Čas *</span>
          <input type="time" className="form-input" value={form.time} step={900} onChange={(e) => set({ time: e.target.value })} required />
        </label>

        {form.date && (
          <div className="admin-field admin-field-full">
            <span>{slots.length > 0 ? 'Rychlý výběr času' : 'V tento den je podle otevírací doby zavřeno'}</span>
            {slots.length > 0 && (
              <div className="admin-chips">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    className="admin-chip"
                    aria-pressed={form.time === slot}
                    disabled={taken.includes(slot)}
                    title={taken.includes(slot) ? 'Obsazeno' : undefined}
                    onClick={() => set({ time: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <label className="admin-field">
          <span>Jméno zákazníka *</span>
          <input className="form-input" value={form.name} maxLength={80} onChange={(e) => set({ name: e.target.value })} required />
        </label>

        <label className="admin-field">
          <span>Telefon *</span>
          <input type="tel" className="form-input" value={form.phone} maxLength={30} onChange={(e) => set({ phone: e.target.value })} required />
        </label>

        <label className="admin-field">
          <span>Vozidlo</span>
          <input className="form-input" value={form.car} maxLength={80} placeholder="např. Škoda Octavia" onChange={(e) => set({ car: e.target.value })} />
        </label>

        <label className="admin-field">
          <span>E-mail</span>
          <input type="email" className="form-input" value={form.email} maxLength={120} onChange={(e) => set({ email: e.target.value })} />
        </label>

        <div className="admin-field admin-field-full">
          <span id="admin-count-label">Počet kol</span>
          <WheelCountPicker labelId="admin-count-label" value={form.wheelCount} onChange={(wheelCount) => set({ wheelCount })} />
        </div>

        <label className="admin-field">
          <span>Rozměr kola</span>
          <select className="form-input" value={form.wheelSize} onChange={(e) => set({ wheelSize: e.target.value })}>
            <option value="">Neuvedeno</option>
            {WHEEL_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>

        <label className="admin-field admin-field-full">
          <span>Poznámka</span>
          <textarea className="form-input" rows={2} value={form.note} maxLength={500} onChange={(e) => set({ note: e.target.value })} />
        </label>
      </div>

      {error && <p className="text-sm text-accent mb-3" role="alert">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" className="btn-tech-secondary btn-compact" onClick={onCancel} disabled={saving}>
          Zrušit
        </button>
        <button type="submit" className="btn-tech-primary btn-compact" disabled={saving || !ready}>
          {saving ? 'Ukládám…' : 'Uložit rezervaci'}
        </button>
      </div>
    </form>
  );
}
