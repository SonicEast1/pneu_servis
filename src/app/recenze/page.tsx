'use client';

import { useState } from 'react';
import type { Metadata } from 'next';

const reviews = [
  {
    id: 1,
    name: 'Jan Novák',
    rating: 5,
    date: '15. 10. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Výborná obsluha, rychlé jednání.',
    avatar: '👨',
  },
  {
    id: 2,
    name: 'Petra Svobodová',
    rating: 5,
    date: '8. 10. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Profesionální přístup, férové ceny. Určitě doporučuji!',
    avatar: '👩',
  },
  {
    id: 3,
    name: 'Martin Dvořák',
    rating: 4,
    date: '2. 10. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Rychlá výměna, ale trochu delší čekací doba.',
    avatar: '👨',
  },
  {
    id: 4,
    name: 'Lucie Procházková',
    rating: 5,
    date: '25. 9. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam. Skvělý servis, milá obsluha, rychlé vyřízení.',
    avatar: '👩',
  },
  {
    id: 5,
    name: 'Tomáš Kučera',
    rating: 5,
    date: '18. 9. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nostrud exercitation ullamco laboris. Nejlepší pneuservis v okolí!',
    avatar: '👨',
  },
  {
    id: 6,
    name: 'Michaela Veselá',
    rating: 4,
    date: '10. 9. 2024',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit. Rychlé a kvalitní provedení.',
    avatar: '👩',
  },
];

export default function ReviewsPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 5,
    text: '',
  });

  const filteredReviews = selectedRating
    ? reviews.filter(r => r.rating === selectedRating)
    : reviews;

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100,
  }));

  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-800 to-neutral-900">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Recenze zákazníků</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Přečtěte si, co o nás říkají naši spokojení zákazníci.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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
                    <button type="submit" className="btn-primary flex-1">
                      Odeslat recenzi
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

            {filteredReviews.map((review, index) => (
              <div
                key={review.id}
                className={`card hover-lift hover-glow animate-fadeInUp stagger-${(index % 6) + 1}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-white">{review.name}</h3>
                        <p className="text-sm text-gray-400">{review.date}</p>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

