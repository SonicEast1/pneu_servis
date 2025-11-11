'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Reservation {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car?: string;
  note?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

const serviceNames: Record<string, string> = {
  'vymena': 'Výměna pneumatik',
  'vyvazeni': 'Vyvážení kol',
  'uskladneni': 'Uskladnění pneu',
  'oprava': 'Oprava pneumatik',
  'prodej': 'Prodej + montáž',
};

const statusLabels: Record<string, string> = {
  'pending': 'Čeká na potvrzení',
  'confirmed': 'Potvrzeno',
  'cancelled': 'Zrušeno',
};

const statusColors: Record<string, string> = {
  'pending': 'bg-yellow-500/20 text-yellow-500 border-yellow-500',
  'confirmed': 'bg-green-500/20 text-green-500 border-green-500',
  'cancelled': 'bg-red-500/20 text-red-500 border-red-500',
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const response = await fetch('/api/rezervace');
      const data = await response.json();
      setReservations(data.reservations || []);
    } catch (error) {
      console.error('Chyba při načítání rezervací:', error);
      alert('Nepodařilo se načíst rezervace');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch('/api/rezervace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        await loadReservations();
      } else {
        alert('Nepodařilo se aktualizovat status');
      }
    } catch (error) {
      console.error('Chyba při aktualizaci statusu:', error);
      alert('Nepodařilo se aktualizovat status');
    }
  };

  const deleteReservation = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto rezervaci?')) return;

    try {
      const response = await fetch(`/api/rezervace?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadReservations();
      } else {
        alert('Nepodařilo se smazat rezervaci');
      }
    } catch (error) {
      console.error('Chyba při mazání rezervace:', error);
      alert('Nepodařilo se smazat rezervaci');
    }
  };

  const exportToCSV = () => {
    window.open('/api/rezervace/export', '_blank');
  };

  const filteredReservations = reservations
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => 
      searchTerm === '' ||
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === 'pending').length,
    confirmed: reservations.filter(r => r.status === 'confirmed').length,
    cancelled: reservations.filter(r => r.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítám rezervace...</p>
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
                Správa rezervací
              </h1>
              <p className="text-gray-600">
                Přehled všech rezervací z webu
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/upload"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                📸 Galerie
              </Link>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                📊 Stáhnout Excel
              </button>
              <button
                onClick={loadReservations}
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
            <div className="text-gray-600 mt-1">Celkem rezervací</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-gray-600 mt-1">Čeká na potvrzení</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-gray-600 mt-1">Potvrzeno</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-gray-600 mt-1">Zrušeno</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Hledat podle jména, emailu, telefonu nebo ID..."
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
                onClick={() => setFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'confirmed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Potvrzeno ({stats.confirmed})
              </button>
            </div>
          </div>
        </div>

        {/* Reservations List */}
        {filteredReservations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Žádné rezervace
            </h3>
            <p className="text-gray-600">
              {searchTerm || filter !== 'all' 
                ? 'Zkuste změnit filtr nebo vyhledávání'
                : 'Zatím nebyly vytvořeny žádné rezervace'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side - Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {reservation.name}
                        </h3>
                        <p className="text-sm text-gray-500 font-mono">
                          ID: {reservation.id}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${
                          statusColors[reservation.status]
                        }`}
                      >
                        {statusLabels[reservation.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">📋 Služba:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {serviceNames[reservation.service] || reservation.service}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">📅 Datum:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {new Date(reservation.date).toLocaleDateString('cs-CZ')} v {reservation.time}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">✉️ Email:</span>
                        <a
                          href={`mailto:${reservation.email}`}
                          className="ml-2 font-medium text-orange-600 hover:underline"
                        >
                          {reservation.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-gray-500">📞 Telefon:</span>
                        <a
                          href={`tel:${reservation.phone}`}
                          className="ml-2 font-medium text-orange-600 hover:underline"
                        >
                          {reservation.phone}
                        </a>
                      </div>
                      {reservation.car && (
                        <div>
                          <span className="text-gray-500">🚗 Vozidlo:</span>
                          <span className="ml-2 font-medium text-gray-800">
                            {reservation.car}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-500">🕐 Vytvořeno:</span>
                        <span className="ml-2 font-medium text-gray-800">
                          {new Date(reservation.createdAt).toLocaleString('cs-CZ')}
                        </span>
                      </div>
                    </div>

                    {reservation.note && (
                      <div className="bg-gray-50 rounded p-3">
                        <span className="text-gray-500 text-sm">💬 Poznámka:</span>
                        <p className="text-gray-800 mt-1">{reservation.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => updateStatus(reservation.id, 'confirmed')}
                      disabled={reservation.status === 'confirmed'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reservation.status === 'confirmed'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      ✅ Potvrdit
                    </button>
                    <button
                      onClick={() => updateStatus(reservation.id, 'pending')}
                      disabled={reservation.status === 'pending'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reservation.status === 'pending'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      }`}
                    >
                      ⏳ Čeká
                    </button>
                    <button
                      onClick={() => updateStatus(reservation.id, 'cancelled')}
                      disabled={reservation.status === 'cancelled'}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        reservation.status === 'cancelled'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      ❌ Zrušit
                    </button>
                    <button
                      onClick={() => deleteReservation(reservation.id)}
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

