'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OpeningHour {
  id: string;
  den: string;
  hodiny: string;
  poradi: number;
  aktivni: boolean;
}

export default function AdminOpeningHoursPage() {
  const [hours, setHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHour, setEditingHour] = useState<OpeningHour | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadHours();
  }, []);

  const loadHours = async () => {
    try {
      const response = await fetch('/api/oteviraci-doba?all=true');
      const data = await response.json();
      setHours(data.hours || []);
    } catch (error) {
      console.error('Chyba při načítání otevírací doby:', error);
      alert('Nepodařilo se načíst otevírací dobu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hour: OpeningHour) => {
    setEditingHour({ ...hour });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingHour({
      id: '',
      den: '',
      hodiny: '',
      poradi: hours.length + 1,
      aktivni: true,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editingHour) return;

    if (!editingHour.den || !editingHour.hodiny) {
      alert('Den a hodiny jsou povinné');
      return;
    }

    try {
      const method = editingHour.id && hours.some(h => h.id === editingHour.id) ? 'PUT' : 'POST';
      
      const response = await fetch('/api/oteviraci-doba', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingHour),
      });

      if (response.ok) {
        await loadHours();
        setShowForm(false);
        setEditingHour(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Nepodařilo se uložit otevírací dobu');
      }
    } catch (error) {
      console.error('Chyba při ukládání otevírací doby:', error);
      alert('Nepodařilo se uložit otevírací dobu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto otevírací dobu?')) return;

    try {
      const response = await fetch(`/api/oteviraci-doba?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadHours();
      } else {
        alert('Nepodařilo se smazat otevírací dobu');
      }
    } catch (error) {
      console.error('Chyba při mazání otevírací doby:', error);
      alert('Nepodařilo se smazat otevírací dobu');
    }
  };

  const toggleActive = async (hour: OpeningHour) => {
    try {
      const response = await fetch('/api/oteviraci-doba', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...hour,
          aktivni: !hour.aktivni,
        }),
      });

      if (response.ok) {
        await loadHours();
      } else {
        alert('Nepodařilo se aktualizovat otevírací dobu');
      }
    } catch (error) {
      console.error('Chyba při aktualizaci otevírací doby:', error);
      alert('Nepodařilo se aktualizovat otevírací dobu');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítám otevírací dobu...</p>
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
                Správa otevírací doby
              </h1>
              <p className="text-gray-600">
                Úprava otevírací doby pro jednotlivé dny v týdnu
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
                href="/admin/sluzby"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                🔧 Služby
              </Link>
              <Link
                href="/admin/recenze"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                ⭐ Recenze
              </Link>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                ➕ Přidat den
              </button>
              <button
                onClick={loadHours}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Obnovit
              </button>
            </div>
          </div>
        </div>

        {/* Form Modal */}
        {showForm && editingHour && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingHour.id ? 'Upravit otevírací dobu' : 'Nová otevírací doba'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Den *
                  </label>
                  <input
                    type="text"
                    value={editingHour.den}
                    onChange={(e) => setEditingHour({ ...editingHour, den: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Např. Pondělí"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hodiny *
                  </label>
                  <input
                    type="text"
                    value={editingHour.hodiny}
                    onChange={(e) => setEditingHour({ ...editingHour, hodiny: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Např. 8:00 - 18:00 nebo Zavřeno"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pořadí
                  </label>
                  <input
                    type="number"
                    value={editingHour.poradi || 0}
                    onChange={(e) => setEditingHour({ ...editingHour, poradi: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aktivni"
                    checked={editingHour.aktivni}
                    onChange={(e) => setEditingHour({ ...editingHour, aktivni: e.target.checked })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="aktivni" className="ml-2 text-sm font-medium text-gray-700">
                    Aktivní (zobrazit na webu)
                  </label>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingHour(null);
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
                >
                  Zrušit
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                >
                  Uložit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hours List */}
        {hours.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🕐</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Žádná otevírací doba
            </h3>
            <p className="text-gray-600 mb-4">
              Zatím nebyly přidány žádné dny
            </p>
            <button
              onClick={handleNew}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              ➕ Přidat první den
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {hours.map((hour) => (
              <div
                key={hour.id}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                  !hour.aktivni ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                  {/* Left side - Info */}
                  <div className="flex-1 flex items-center gap-6">
                    <div className="text-3xl">🕐</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {hour.den}
                      </h3>
                      <p className="text-gray-600">
                        {hour.hodiny}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      Pořadí: {hour.poradi}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        hour.aktivni
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {hour.aktivni ? 'Aktivní' : 'Neaktivní'}
                    </span>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex gap-2 lg:w-48">
                    <button
                      onClick={() => handleEdit(hour)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ✏️ Upravit
                    </button>
                    <button
                      onClick={() => toggleActive(hour)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        hour.aktivni
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {hour.aktivni ? '👁️ Skrýt' : '👁️ Zobrazit'}
                    </button>
                    <button
                      onClick={() => handleDelete(hour.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
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

