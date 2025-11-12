'use client';

import { useState, useEffect } from 'react';

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
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/recenze?approved=true');
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Chyba při načítání recenzí:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.text) {
      alert('Vyplňte prosím všechna pole');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/recenze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Děkujeme za recenzi!\n\nVaše recenze byla odeslána a čeká na schválení správcem. Po schválení se zobrazí na webu.`);
        setFormData({
          name: '',
          email: '',
          rating: 5,
          text: '',
        });
        setShowReviewForm(false);
      } else {
        alert(`❌ Chyba: ${data.error || 'Nepodařilo se odeslat recenzi'}`);
      }
    } catch (error) {
      console.error('Chyba při odesílání recenze:', error);
      alert('❌ Nastala chyba při odesílání recenze. Zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = selectedRating
    ? reviews.filter(r => r.rating === selectedRating)
    : reviews;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
      : 0,
  }));

  const getAvatar = (name: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    return firstLetter;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Načítám recenze...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 relative">
      {/* Background blur effect - celá stránka */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-500/60 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-800 via-neutral-800/80 to-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Recenze zákazníků</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Přečtěte si, co o nás říkají naši spokojení zákazníci.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-900/95">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 animate-fadeInLeft">
              <h2 className="text-2xl font-bold mb-6 text-white">Celkové hodnocení</h2>
              
              <div className="text-center mb-8">
                <div className="text-6xl font-black gradient-text mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-3xl text-orange-500">★</span>
                  ))}
                </div>
                <p className="text-gray-400">Na základě {reviews.length} recenzí</p>
              </div>

              <div className="space-y-3 mb-8">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm text-gray-300 w-8">{rating}★</span>
                    <div className="flex-1 h-3 bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 w-8">{count}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-3 text-white">Filtrovat podle hodnocení</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedRating(null)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedRating === null
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                  }`}
                >
                  Vše
                </button>
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedRating === rating
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                        : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'
                    }`}
                  >
                    {rating}★
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full btn-primary"
              >
                Napsat recenzi
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {showReviewForm && (
              <div className="card animate-scaleIn">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Napište recenzi</h3>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Jméno
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Vaše jméno"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-neutral-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="vas@email.cz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hodnocení
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating })}
                          className={`text-4xl transition-all ${
                            rating <= formData.rating ? 'text-orange-500' : 'text-gray-600'
                          } hover:scale-110`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Vaše recenze
                    </label>
                    <textarea
                      value={formData.text}
                      onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-neutral-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Napište svou recenzi..."
                    />
                  </div>

                  <div className="flex gap-3">
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className={`btn-primary flex-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {submitting ? 'Odesílám...' : 'Odeslat recenzi'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-3 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors"
                    >
                      Zrušit
                    </button>
                  </div>
                </form>
              </div>
            )}

            {filteredReviews.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedRating ? 'Žádné recenze s tímto hodnocením' : 'Zatím žádné recenze'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {selectedRating 
                    ? 'Zkuste zobrazit všechny recenze' 
                    : 'Buďte první, kdo napíše recenzi!'}
                </p>
                <button
                  onClick={() => {
                    if (selectedRating) {
                      setSelectedRating(null);
                    } else {
                      setShowReviewForm(true);
                    }
                  }}
                  className="btn-primary"
                >
                  {selectedRating ? 'Zobrazit vše' : 'Napsat recenzi'}
                </button>
              </div>
            ) : (
              filteredReviews.map((review, index) => (
                <div
                  key={review.id}
                  className={`card hover-lift hover-glow animate-fadeInUp stagger-${(index % 6) + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                      {getAvatar(review.name)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-white">{review.name}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(review.createdAt).toLocaleDateString('cs-CZ')}
                          </p>
                        </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < review.rating ? 'text-orange-500' : 'text-gray-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                      <p className="text-gray-300 leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

