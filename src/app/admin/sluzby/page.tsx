'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Service {
  id: string;
  nazev: string;
  popis: string;
  ikona: string;
  cenaOsobni: string;
  cenaSUV: string;
  features: string;
  kategorie?: string;
  aktivni: boolean;
  poradi?: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/sluzby?all=true');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Chyba při načítání služeb:', error);
      alert('Nepodařilo se načíst služby');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService({ ...service });
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingService({
      id: '',
      nazev: '',
      popis: '',
      ikona: '🔧',
      cenaOsobni: '',
      cenaSUV: '',
      features: '',
      kategorie: '',
      aktivni: true,
      poradi: services.length + 1,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!editingService) return;

    if (!editingService.nazev || !editingService.popis || !editingService.cenaOsobni) {
      alert('Název, popis a cena osobní auto jsou povinné');
      return;
    }

    try {
      const method = editingService.id && services.some(s => s.id === editingService.id) ? 'PUT' : 'POST';
      const url = method === 'POST' ? '/api/sluzby' : '/api/sluzby';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (response.ok) {
        await loadServices();
        setShowForm(false);
        setEditingService(null);
      } else {
        const error = await response.json();
        alert(error.error || 'Nepodařilo se uložit službu');
      }
    } catch (error) {
      console.error('Chyba při ukládání služby:', error);
      alert('Nepodařilo se uložit službu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tuto službu?')) return;

    try {
      const response = await fetch(`/api/sluzby?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadServices();
      } else {
        alert('Nepodařilo se smazat službu');
      }
    } catch (error) {
      console.error('Chyba při mazání služby:', error);
      alert('Nepodařilo se smazat službu');
    }
  };

  const toggleActive = async (service: Service) => {
    try {
      const response = await fetch('/api/sluzby', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...service,
          aktivni: !service.aktivni,
        }),
      });

      if (response.ok) {
        await loadServices();
      } else {
        alert('Nepodařilo se aktualizovat službu');
      }
    } catch (error) {
      console.error('Chyba při aktualizaci služby:', error);
      alert('Nepodařilo se aktualizovat službu');
    }
  };

  const filteredServices = services.filter(s =>
    searchTerm === '' ||
    s.nazev.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.popis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.kategorie && s.kategorie.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stats = {
    total: services.length,
    active: services.filter(s => s.aktivni).length,
    inactive: services.filter(s => !s.aktivni).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Načítám služby...</p>
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
                Správa služeb a ceníku
              </h1>
              <p className="text-gray-600">
                Přidávání, úprava a správa služeb a jejich cen
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
                href="/admin/recenze"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                ⭐ Recenze
              </Link>
              <Link
                href="/admin/upload"
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                📸 Galerie
              </Link>
              <button
                onClick={handleNew}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                ➕ Přidat službu
              </button>
              <button
                onClick={loadServices}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Obnovit
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
            <div className="text-gray-600 mt-1">Celkem služeb</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
            <div className="text-gray-600 mt-1">Aktivních</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-gray-400">{stats.inactive}</div>
            <div className="text-gray-600 mt-1">Neaktivních</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <input
            type="text"
            placeholder="🔍 Hledat podle názvu, popisu nebo kategorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Form Modal */}
        {showForm && editingService && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingService.id ? 'Upravit službu' : 'Nová služba'}
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Název služby *
                    </label>
                    <input
                      type="text"
                      value={editingService.nazev}
                      onChange={(e) => setEditingService({ ...editingService, nazev: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Např. Výměna pneumatik"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ikona (emoji)
                    </label>
                    <input
                      type="text"
                      value={editingService.ikona}
                      onChange={(e) => setEditingService({ ...editingService, ikona: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="🔧"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Popis *
                  </label>
                  <textarea
                    value={editingService.popis}
                    onChange={(e) => setEditingService({ ...editingService, popis: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Detailní popis služby..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cena osobní auto *
                    </label>
                    <input
                      type="text"
                      value={editingService.cenaOsobni}
                      onChange={(e) => setEditingService({ ...editingService, cenaOsobni: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="400 Kč"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cena SUV/Dodávka
                    </label>
                    <input
                      type="text"
                      value={editingService.cenaSUV}
                      onChange={(e) => setEditingService({ ...editingService, cenaSUV: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="600 Kč"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Funkce (oddělené středníkem)
                  </label>
                  <textarea
                    value={editingService.features}
                    onChange={(e) => setEditingService({ ...editingService, features: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Funkce 1;Funkce 2;Funkce 3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Oddělte jednotlivé funkce středníkem (;)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kategorie
                    </label>
                    <input
                      type="text"
                      value={editingService.kategorie || ''}
                      onChange={(e) => setEditingService({ ...editingService, kategorie: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Základní služby"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pořadí
                    </label>
                    <input
                      type="number"
                      value={editingService.poradi || 0}
                      onChange={(e) => setEditingService({ ...editingService, poradi: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="aktivni"
                    checked={editingService.aktivni}
                    onChange={(e) => setEditingService({ ...editingService, aktivni: e.target.checked })}
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
                    setEditingService(null);
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

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Žádné služby
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? 'Zkuste změnit vyhledávání'
                : 'Zatím nebyly přidány žádné služby'}
            </p>
            {!searchTerm && (
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                ➕ Přidat první službu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                  !service.aktivni ? 'opacity-60' : ''
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Left side - Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-4xl">{service.ikona}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {service.nazev}
                          </h3>
                          {service.kategorie && (
                            <p className="text-sm text-gray-500">
                              {service.kategorie}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          service.aktivni
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {service.aktivni ? 'Aktivní' : 'Neaktivní'}
                      </span>
                    </div>

                    <p className="text-gray-700">{service.popis}</p>

                    {service.features && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">Funkce:</p>
                        <div className="flex flex-wrap gap-2">
                          {service.features.split(';').map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm"
                            >
                              {feature.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                      <div>
                        <span className="text-sm text-gray-500">Cena osobní auto:</span>
                        <span className="ml-2 font-bold text-orange-600">
                          {service.cenaOsobni}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Cena SUV/Dodávka:</span>
                        <span className="ml-2 font-bold text-orange-600">
                          {service.cenaSUV}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      ✏️ Upravit
                    </button>
                    <button
                      onClick={() => toggleActive(service)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        service.aktivni
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {service.aktivni ? '👁️ Skrýt' : '👁️ Zobrazit'}
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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

