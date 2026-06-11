'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import TechBackground from '@/components/TechBackground';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  createdAt: string;
  status: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', rating: 5, text: '' });

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    try {
      const r = await fetch('/api/recenze?approved=true');
      const data = await r.json();
      setReviews(data.reviews || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.text) { alert('Vyplňte prosím všechna pole'); return; }
    setSubmitting(true);
    try {
      const r = await fetch('/api/recenze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await r.json();
      if (r.ok) {
        alert('✅ Děkujeme za recenzi! Po schválení se zobrazí na webu.');
        setFormData({ name: '', email: '', rating: 5, text: '' });
        setShowReviewForm(false);
      } else { alert(`❌ Chyba: ${data.error || 'Nepodařilo se odeslat recenzi'}`); }
    } catch { alert('❌ Nastala chyba. Zkuste to prosím znovu.'); }
    finally { setSubmitting(false); }
  };

  const filteredReviews = selectedRating ? reviews.filter(r => r.rating === selectedRating) : reviews;
  const averageRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '0.0';
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0,
  }));

  if (loading) {
    return (
      <TechBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--accent)] mx-auto mb-4" />
            <p className="text-theme-secondary">Načítám recenze...</p>
          </div>
        </div>
      </TechBackground>
    );
  }

  return (
    <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Recenze</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Co říkají <span className="gradient-tech">zákazníci</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Přečtěte si, co o nás říkají naši spokojení zákazníci.
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="tech-panel animate-fadeInUp">
                <h2 className="font-display text-xl font-bold text-theme mb-6">Celkové hodnocení</h2>
                <div className="text-center mb-8">
                  <div className="font-display text-6xl font-black text-accent mb-2">{averageRating}</div>
                  <div className="flex justify-center gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => <span key={i} className="text-2xl text-accent">★</span>)}
                  </div>
                  <p className="text-theme-muted text-sm">Na základě {reviews.length} recenzí</p>
                </div>

                <div className="space-y-2 mb-8">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center gap-2">
                      <span className="text-sm text-theme-secondary w-6 font-semibold">{rating}★</span>
                      <div className="flex-1 h-2 bg-[var(--bg-surface-alt)] rounded-full overflow-hidden">
                        <div className="h-full bg-accent transition-all duration-500 rounded-full" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-sm text-theme-muted w-5 text-right">{count}</span>
                    </div>
                  ))}
                </div>

                <h3 className="font-display font-semibold text-theme mb-3 text-sm">Filtrovat</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  <button
                    onClick={() => setSelectedRating(null)}
                    className={`px-3 py-1.5 text-sm font-display font-semibold border-2 rounded transition-all ${selectedRating === null ? 'bg-accent border-accent text-white' : 'border-[var(--border-strong)] text-theme hover:border-accent hover:text-accent'}`}
                  >
                    Vše
                  </button>
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(rating)}
                      className={`px-3 py-1.5 text-sm font-display font-semibold border-2 rounded transition-all ${selectedRating === rating ? 'bg-accent border-accent text-white' : 'border-[var(--border-strong)] text-theme hover:border-accent hover:text-accent'}`}
                    >
                      {rating}★
                    </button>
                  ))}
                </div>

                <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-tech-primary w-full">
                  Napsat recenzi
                </button>
              </div>
            </div>

            {/* Reviews */}
            <div className="lg:col-span-2 space-y-5">
              {showReviewForm && (
                <div className="tech-panel animate-fadeInUp">
                  <h3 className="font-display text-xl font-bold text-theme mb-5">Napište recenzi</h3>
                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                      <label className="form-label">Jméno</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Vaše jméno" />
                    </div>
                    <div>
                      <label className="form-label">E-mail</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="vas@email.cz" />
                    </div>
                    <div>
                      <label className="form-label">Hodnocení</label>
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button key={rating} type="button" onClick={() => setFormData({ ...formData, rating })}
                            className={`text-3xl transition-all ${rating <= formData.rating ? 'text-accent' : 'text-[var(--border-strong)]'}`}>★</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Vaše recenze</label>
                      <textarea value={formData.text} onChange={(e) => setFormData({ ...formData, text: e.target.value })} rows={4} className="form-input resize-none" placeholder="Napište svou recenzi..." />
                    </div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={submitting} className={`btn-tech-primary flex-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {submitting ? 'Odesílám...' : 'Odeslat recenzi'}
                      </button>
                      <button type="button" onClick={() => setShowReviewForm(false)} className="btn-tech-secondary px-6">Zrušit</button>
                    </div>
                  </form>
                </div>
              )}

              {filteredReviews.length === 0 ? (
                <div className="tech-panel text-center py-12">
                  <div className="text-5xl mb-4">⭐</div>
                  <h3 className="font-display text-xl font-bold text-theme mb-2">
                    {selectedRating ? 'Žádné recenze s tímto hodnocením' : 'Zatím žádné recenze'}
                  </h3>
                  <p className="text-theme-muted mb-6 text-sm">
                    {selectedRating ? 'Zkuste zobrazit všechny recenze' : 'Buďte první, kdo napíše recenzi!'}
                  </p>
                  <button onClick={() => selectedRating ? setSelectedRating(null) : setShowReviewForm(true)} className="btn-tech-primary">
                    {selectedRating ? 'Zobrazit vše' : 'Napsat recenzi'}
                  </button>
                </div>
              ) : (
                filteredReviews.map((review, index) => (
                  <div key={review.id} className={`tech-panel animate-fadeInUp stagger-${(index % 4) + 1}`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0 rounded-sm">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div>
                            <h3 className="font-display font-bold text-theme">{review.name}</h3>
                            <p className="text-xs text-theme-muted">{new Date(review.createdAt).toLocaleDateString('cs-CZ')}</p>
                          </div>
                          <div className="flex flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < review.rating ? 'text-accent' : 'text-[var(--border-strong)]'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className="text-theme-secondary text-sm leading-relaxed">{review.text}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </TechBackground>
  );
}
