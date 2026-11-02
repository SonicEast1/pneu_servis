'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Loading, PageHeader, Segmented } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';
import ReservationForm from '@/components/admin/ReservationForm';
import { getPragueParts, pragueDate } from '@/lib/openingHours';
import { wheelCountLabel } from '@/constants/reservation';

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
  wheelSize: string;
  wheelCount: string;
  note: string;
  status: Status;
  createdAt: string;
}

type Filter = 'upcoming' | 'new' | 'past' | 'all';

/** Termín jako „YYYY-MM-DD HH:MM“ — dá se porovnávat jako text. */
const slotKey = (r: Pick<Reservation, 'date' | 'time'>) => `${r.date} ${r.time.padStart(5, '0')}`;

function nowKey(): string {
  const minutes = getPragueParts().minutes;
  const clock = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  return `${pragueDate()} ${clock}`;
}

/** Stav k zobrazení: potvrzená rezervace, jejíž čas už nastal, je „Proběhlá“. */
function displayStatus(r: Reservation, now: string): { label: string; tone: string } {
  if (r.status === 'cancelled') return { label: 'Zrušená', tone: 'hidden' };
  if (r.status === 'confirmed') {
    return slotKey(r) <= now ? { label: 'Proběhlá', tone: 'done' } : { label: 'Potvrzená', tone: 'visible' };
  }
  return { label: 'Nová', tone: 'unavailable' };
}

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
  // Potvrzené (nadcházející) jsou hlavní pohled
  const [filter, setFilter] = useState<Filter>('upcoming');
  const [adding, setAdding] = useState(false);
  // Hodiny „tikají“ po minutě, aby se rezervace přepnula na Proběhlou i bez obnovení stránky
  const [now, setNow] = useState(nowKey);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(nowKey()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

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
  const isPast = (item: Reservation) => slotKey(item) <= now;
  const newCount = reservations.filter((item) => item.status === 'pending' && !isPast(item)).length;
  const filters: { value: Filter; label: string }[] = [
    { value: 'upcoming', label: 'Potvrzené' },
    { value: 'new', label: newCount > 0 ? `Nové (${newCount})` : 'Nové' },
    { value: 'past', label: 'Proběhlé a zrušené' },
    { value: 'all', label: 'Vše' },
  ];
  const visible = reservations
    .filter((item) => {
      if (filter === 'new') return item.status === 'pending' && !isPast(item);
      if (filter === 'upcoming') return item.status === 'confirmed' && !isPast(item);
      if (filter === 'past') return item.status === 'cancelled' || isPast(item);
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
        description="Rezervace z webu i po telefonu. Potvrzená rezervace se po uplynutí svého času sama přesune mezi proběhlé."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-tech-primary btn-compact" onClick={() => setAdding((open) => !open)}>
              {adding ? 'Zavřít' : '+ Nová rezervace'}
            </button>
            <a href="/api/rezervace/export" className="btn-tech-secondary btn-compact">
              Stáhnout Excel
            </a>
          </div>
        }
      />

      {adding && (
        <ReservationForm
          onCancel={() => setAdding(false)}
          onSaved={() => {
            setAdding(false);
            setFilter('upcoming');
            toast({ text: 'Rezervace uložena jako potvrzená.', tone: 'ok' });
            load();
          }}
        />
      )}

      <div className="mb-5">
        <Segmented label="Filtr rezervací" value={filter} options={filters} onChange={setFilter} />
      </div>

      {visible.length === 0 ? (
        <p className="admin-card text-theme-secondary text-sm">
          {filter === 'new'
            ? 'Žádné nové rezervace. Až někdo pošle rezervaci z webu, objeví se tady.'
            : filter === 'upcoming'
              ? 'Žádné nadcházející potvrzené rezervace. Objednávku po telefonu přidáte tlačítkem Nová rezervace.'
              : 'Nic k zobrazení.'}
        </p>
      ) : (
        Object.entries(groups).map(([date, items]) => (
          <section key={date} className="mb-6">
            <h2 className="admin-day-title">
              {formatDay(date)}
              {date === today && <span className="admin-pill" data-tone="visible">Dnes</span>}
            </h2>
            <ul className="admin-list">
              {items.map((item) => {
                const shown = displayStatus(item, now);
                const past = isPast(item);
                return (
                <li key={item.id} className="admin-card admin-booking" data-muted={item.status === 'cancelled' || past}>
                  <div className="admin-booking-time">{item.time}</div>
                  <div className="admin-booking-main">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-semibold text-theme">{item.name}</span>
                      <span className="admin-pill" data-tone={shown.tone}>{shown.label}</span>
                    </div>
                    <p className="text-theme-secondary text-sm">
                      {[
                        item.service,
                        item.car,
                        item.wheelCount && wheelCountLabel(item.wheelCount),
                        item.wheelSize && `rozměr ${item.wheelSize}`,
                      ].filter(Boolean).join(' · ')}
                    </p>
                    <p className="text-sm">
                      <a href={`tel:${item.phone.replace(/\s/g, '')}`} className="text-accent font-semibold">{item.phone}</a>
                      {item.email && (
                        <>
                          <span className="text-theme-muted"> · </span>
                          <a href={`mailto:${item.email}`} className="text-theme-secondary underline-offset-2 hover:underline">{item.email}</a>
                        </>
                      )}
                    </p>
                    {item.note && <p className="admin-booking-note">{item.note}</p>}
                  </div>
                  <div className="admin-booking-actions">
                    {item.status !== 'confirmed' && !past && (
                      <button type="button" className="btn-tech-primary btn-compact" onClick={() => setStatus(item, 'confirmed')}>
                        Potvrdit
                      </button>
                    )}
                    {item.status !== 'cancelled' && !past && (
                      <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setStatus(item, 'cancelled')}>
                        Zrušit
                      </button>
                    )}
                    <button type="button" className="admin-link-button is-danger" onClick={() => remove(item)}>
                      Smazat
                    </button>
                  </div>
                </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </>
  );
}
