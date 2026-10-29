'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Loading, PageHeader, Segmented } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';
import { pragueDate } from '@/lib/openingHours';

type Status = 'pending' | 'confirmed' | 'cancelled';

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  note: string;
  status: Status;
  createdAt: string;
}

type Filter = 'new' | 'upcoming' | 'past' | 'all';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'new', label: 'Nové' },
  { value: 'upcoming', label: 'Potvrzené' },
  { value: 'past', label: 'Proběhlé a zrušené' },
  { value: 'all', label: 'Vše' },
];

const STATUS_LABEL: Record<Status, string> = { pending: 'Nová', confirmed: 'Potvrzená', cancelled: 'Zrušená' };
const STATUS_TONE: Record<Status, string> = { pending: 'unavailable', confirmed: 'visible', cancelled: 'hidden' };

function formatDay(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  // Rok jen u jiného než letošního roku, ať jsou staré rezervace jednoznačné
  const thisYear = Number(pragueDate().slice(0, 4));
  const text = new Intl.DateTimeFormat('cs-CZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: year === thisYear ? undefined : 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function AdminReservationsPage() {
  const toast = useToast();
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [filter, setFilter] = useState<Filter>('new');

  const load = useCallback(() => {
    api<{ reservations: Reservation[] }>('/api/rezervace')
      .then((data) => setReservations(data.reservations))
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [toast]);

  useEffect(load, [load]);

  const setStatus = async (reservation: Reservation, status: Status) => {
    try {
      await api('/api/rezervace', { method: 'PATCH', json: { id: reservation.id, status } });
      setReservations((list) => list?.map((item) => (item.id === reservation.id ? { ...item, status } : item)) ?? null);
      toast({ text: status === 'confirmed' ? 'Rezervace potvrzena.' : 'Rezervace zrušena, termín je zase volný.', tone: 'ok' });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  const remove = async (reservation: Reservation) => {
    if (!window.confirm(`Smazat rezervaci ${reservation.name}? Tohle nejde vrátit.`)) return;
    try {
      await api(`/api/rezervace?id=${encodeURIComponent(reservation.id)}`, { method: 'DELETE' });
      setReservations((list) => list?.filter((item) => item.id !== reservation.id) ?? null);
      toast({ text: 'Rezervace smazána.', tone: 'ok' });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  if (!reservations) return <Loading />;

  const today = pragueDate();
  const visible = reservations
    .filter((item) => {
      if (filter === 'new') return item.status === 'pending';
      if (filter === 'upcoming') return item.status === 'confirmed' && item.date >= today;
      if (filter === 'past') return item.status === 'cancelled' || item.date < today;
      return true;
    })
    // Nadcházející od nejbližšího, minulé od nejnovějšího
    .sort((a, b) => {
      const key = (r: Reservation) => `${r.date} ${r.time.padStart(5, '0')}`;
      return filter === 'past' || filter === 'all' ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b));
    });

  const groups = visible.reduce<Record<string, Reservation[]>>((acc, item) => {
    (acc[item.date] ??= []).push(item);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Rezervace"
        description="Rezervace z webu. Zákazníkovi potvrďte termín telefonem nebo e-mailem a pak klikněte na Potvrdit."
        action={
          <a href="/api/rezervace/export" className="btn-tech-secondary btn-compact">
            Stáhnout Excel
          </a>
        }
      />

      <div className="mb-5">
        <Segmented label="Filtr rezervací" value={filter} options={FILTERS} onChange={setFilter} />
      </div>

      {visible.length === 0 ? (
        <p className="admin-card text-theme-secondary text-sm">
          {filter === 'new' ? 'Žádné nové rezervace. Až někdo pošle rezervaci z webu, objeví se tady.' : 'Nic k zobrazení.'}
        </p>
      ) : (
        Object.entries(groups).map(([date, items]) => (
          <section key={date} className="mb-6">
            <h2 className="admin-day-title">
              {formatDay(date)}
              {date === today && <span className="admin-pill" data-tone="visible">Dnes</span>}
            </h2>
            <ul className="admin-list">
              {items.map((item) => (
                <li key={item.id} className="admin-card admin-booking" data-muted={item.status === 'cancelled'}>
                  <div className="admin-booking-time">{item.time}</div>
                  <div className="admin-booking-main">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-theme">{item.name}</span>
                      <span className="admin-pill" data-tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</span>
                    </div>
                    <p className="text-theme-secondary text-sm">{item.service}{item.car ? ` · ${item.car}` : ''}</p>
                    <p className="text-sm">
                      <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="text-accent font-semibold">{item.phone}</a>
                      <span className="text-theme-muted"> · </span>
                      <a href={`mailto:${item.email}`} className="text-theme-secondary underline-offset-2 hover:underline">{item.email}</a>
                    </p>
                    {item.note && <p className="admin-booking-note">{item.note}</p>}
                  </div>
                  <div className="admin-booking-actions">
                    {item.status !== 'confirmed' && (
                      <button type="button" className="btn-tech-primary btn-compact" onClick={() => setStatus(item, 'confirmed')}>
                        Potvrdit
                      </button>
                    )}
                    {item.status !== 'cancelled' && (
                      <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setStatus(item, 'cancelled')}>
                        Zrušit
                      </button>
                    )}
                    <button type="button" className="admin-link-button is-danger" onClick={() => remove(item)}>
                      Smazat
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
