'use client';

import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, Loading, PageHeader } from '@/components/admin/ui';
import { useToast } from '@/components/admin/AdminShell';

type Status = 'pending' | 'approved' | 'hidden';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  status: Status;
  createdAt: string;
}

const STATUS_LABEL: Record<Status, string> = {
  pending: 'Čeká na schválení',
  approved: 'Na webu',
  hidden: 'Skrytá',
};

const dateFormat = new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' });

function Stars({ value, onChange }: { value: number; onChange?: (value: number) => void }) {
  if (!onChange) {
    return <span className="admin-stars" aria-label={`${value} z 5`}>{'★'.repeat(value)}<span>{'★'.repeat(5 - value)}</span></span>;
  }
  return (
    <span className="admin-stars is-input" role="radiogroup" aria-label="Hodnocení">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} z 5`}
          data-on={star <= value}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', rating: 5, text: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api<{ reviews: Review[] }>('/api/recenze?all=1')
      .then((data) => setReviews(data.reviews))
      .catch((error: Error) => toast({ text: error.message, tone: 'error' }));
  }, [toast]);

  useEffect(load, [load]);

  const setStatus = async (review: Review, status: Status) => {
    try {
      await api('/api/recenze', { method: 'PATCH', json: { id: review.id, status } });
      setReviews((list) => list?.map((item) => (item.id === review.id ? { ...item, status } : item)) ?? null);
      toast({
        text: status === 'approved' ? 'Recenze je na webu.' : 'Recenze skryta.',
        tone: 'ok',
        link: status === 'approved' ? { href: '/recenze', label: 'Zobrazit' } : undefined,
      });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  const remove = async (review: Review) => {
    if (!window.confirm(`Smazat recenzi od ${review.name}? Tohle nejde vrátit.`)) return;
    try {
      await api(`/api/recenze?id=${encodeURIComponent(review.id)}`, { method: 'DELETE' });
      setReviews((list) => list?.filter((item) => item.id !== review.id) ?? null);
      toast({ text: 'Recenze smazána.', tone: 'ok' });
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    }
  };

  const add = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await api('/api/recenze', { method: 'POST', json: draft });
      setDraft({ name: '', rating: 5, text: '' });
      setAdding(false);
      toast({ text: 'Recenze přidána na web.', tone: 'ok', link: { href: '/recenze', label: 'Zobrazit' } });
      load();
    } catch (error) {
      toast({ text: (error as Error).message, tone: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (!reviews) return <Loading />;

  // Čekající nahoru, pak podle data
  const sorted = [...reviews].sort((a, b) => Number(b.status === 'pending') - Number(a.status === 'pending'));

  return (
    <>
      <PageHeader
        title="Recenze"
        description="Recenze na stránce Recenze. Na webu jsou jen ty se stavem „Na webu“."
        action={
          <button type="button" className="btn-tech-primary btn-compact" onClick={() => setAdding((open) => !open)}>
            {adding ? 'Zavřít' : '+ Přidat recenzi'}
          </button>
        }
      />

      {adding && (
        <form onSubmit={add} className="admin-card mb-6">
          <h2 className="admin-h2">Nová recenze</h2>
          <p className="text-theme-secondary text-sm mb-4">
            Třeba recenze, kterou vám zákazník napsal do zprávy. Po uložení se hned ukáže na webu.
          </p>
          <div className="admin-form-grid">
            <label className="admin-field admin-field-wide">
              <span>Jméno zákazníka</span>
              <input className="form-input" value={draft.name} maxLength={60} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
            </label>
            <div className="admin-field">
              <span>Hodnocení</span>
              <Stars value={draft.rating} onChange={(rating) => setDraft({ ...draft, rating })} />
            </div>
            <label className="admin-field admin-field-full">
              <span>Text recenze</span>
              <textarea className="form-input" rows={4} value={draft.text} maxLength={1000} onChange={(e) => setDraft({ ...draft, text: e.target.value })} required />
            </label>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="btn-tech-primary btn-compact" disabled={saving}>
              {saving ? 'Ukládám…' : 'Přidat na web'}
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="admin-card text-theme-secondary text-sm">Zatím žádné recenze. Přidejte první tlačítkem nahoře.</p>
      ) : (
        <ul className="admin-list">
          {sorted.map((review) => (
            <li key={review.id} className="admin-card admin-review" data-muted={review.status === 'hidden'}>
              <div className="admin-review-head">
                <div>
                  <span className="font-display font-semibold text-theme">{review.name}</span>
                  <span className="text-theme-muted text-xs ml-2">{dateFormat.format(new Date(review.createdAt))}</span>
                </div>
                <Stars value={review.rating} />
                <span className="admin-pill" data-tone={review.status === 'approved' ? 'visible' : review.status === 'pending' ? 'unavailable' : 'hidden'}>
                  {STATUS_LABEL[review.status]}
                </span>
              </div>
              <p className="text-theme-secondary text-sm leading-relaxed">{review.text}</p>
              <div className="admin-review-actions">
                {review.status !== 'approved' && (
                  <button type="button" className="btn-tech-primary btn-compact" onClick={() => setStatus(review, 'approved')}>
                    Zobrazit na webu
                  </button>
                )}
                {review.status !== 'hidden' && (
                  <button type="button" className="btn-tech-secondary btn-compact" onClick={() => setStatus(review, 'hidden')}>
                    Skrýt
                  </button>
                )}
                <button type="button" className="admin-link-button is-danger" onClick={() => remove(review)}>
                  Smazat
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
