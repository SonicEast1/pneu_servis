'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  text: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

const statusLabels: Record<string, string> = {
  'pending': 'Čeká na schválení',
  'approved': 'Schváleno',
  'rejected': 'Zamítnuto',
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
  'approved': 'bg-green-500/20 text-green-500 border-green-500',
  'rejected': 'bg-red-500/20 text-red-500 border-red-500',
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/recenze');
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Chyba při načítání recenzí:', error);
      alert('Nepodařilo se načíst recenze');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/recenze', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await loadReviews();
      } else {
        alert('Nepodařilo se aktualizovat status');
      }
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
      alert('Nepodařilo se aktualizovat status');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto recenzi?')) return;

    try {
      const response = await fetch(`/api/recenze?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadReviews();
      } else {
        alert('Nepodařilo se smazat recenzi');
      }
    } catch (error) {
      console.error('Chyba při mazání recenze:', error);
      alert('Nepodařilo se smazat recenzi');
    }
  };

  const filteredReviews = reviews
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => 
      searchTerm === '' ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítám recenze...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                Správa recenzí
              </h1>
              <p className="text-gray-600">
                Schvalování a správa zákaznických recenzí
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/rezervace"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                📅 Rezervace
              </Link>
              <Link
                href="/admin/upload"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                📸 Galerie
              </Link>
              <button
                onClick={loadReviews}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Obnovit
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-gray-600 mt-1">Celkem recenzí</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600 mt-1">Čeká na schválení</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-gray-600 mt-1">Schváleno</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-gray-600 mt-1">Zamítnuto</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Hledat podle jména, emailu nebo textu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Vše ({stats.total})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Čeká ({stats.pending})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'approved'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Schváleno ({stats.approved})
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">⭐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Žádné recenze
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Zkuste změnit filtr nebo vyhledávání'
                : 'Zatím nebyly odeslány žádné recenze'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side - Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {review.name}
                        </h3>
                        <a
                          href={`mailto:${review.email}`}
                          className="text-sm text-orange-600 hover:underline"
                        >
                          {review.email}
                        </a>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          statusColors[review.status]
                        }`}
                      >
                        {statusLabels[review.status]}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Hodnocení:</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < review.rating ? 'text-orange-500' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-gray-700 font-semibold">
                        {review.rating}/5
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded p-4">
                      <p className="text-gray-800 leading-relaxed">{review.text}</p>
                    </div>

                    <div className="text-sm text-gray-500">
                      📅 Odesláno: {new Date(review.createdAt).toLocaleString('cs-CZ')}
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => updateStatus(review.id, 'approved')}
                      disabled={review.status === 'approved'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        review.status === 'approved'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      ✅ Schválit
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, 'pending')}
                      disabled={review.status === 'pending'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        review.status === 'pending'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }`}
                    >
                      ⏳ Čeká
                    </button>
                    <button
                      onClick={() => updateStatus(review.id, 'rejected')}
                      disabled={review.status === 'rejected'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        review.status === 'rejected'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      ❌ Zamítnout
                    </button>
                    <button
                      onClick={() => deleteReview(review.id)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-lg font-medium transition-colors"
                    >
                      🗑️ Smazat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

