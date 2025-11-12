'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const process = [
  {
    title: 'Rezervace',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    title: 'Příjezd',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    title: 'Servis',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    title: 'Platba',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
];

export default function SluzbyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/sluzby');
      const data = await response.json();
      setServices(data.services || []);
    } catch (error) {
      console.error('Chyba při načítání služeb:', error);
    } finally {
      setLoading(false);
    }
  };

  // Vytvořit pricing table z aktivních služeb
  const pricingTable = services
    .filter(s => s.aktivni)
    .map(service => ({
      service: service.nazev,
      car: service.cenaOsobni,
      suv: service.cenaSUV,
    }));

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Načítám služby...</p>
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-neutral-800 via-neutral-800/80 to-neutral-900/98">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fadeInUp">
            <span className="gradient-text">Naše služby</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp stagger-2">
            Kompletní přehled našich služeb a cen. Profesionální péče o vaše pneumatiky a kola.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      {services.length > 0 ? (
        <section className="section-padding bg-gradient-to-b from-neutral-900/98 via-neutral-900 to-neutral-900/95">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`card group hover-lift hover-glow cursor-pointer animate-fadeInUp stagger-${(index % 6) + 1}`}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {service.ikona}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 gradient-text group-hover:tracking-wide transition-all duration-300">
                    {service.nazev}
                  </h3>
                  <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {service.popis}
                  </p>
                  {service.features && (
                    <ul className="space-y-2 mb-6">
                      {service.features.split(';').map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-gray-300 text-sm transform group-hover:translate-x-1 transition-transform duration-300"
                          style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                          <span className="text-orange-500 mr-2 group-hover:scale-125 transition-transform duration-300">✓</span>
                          {feature.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Cena od</span>
                      <span className="text-2xl font-bold gradient-text">{service.cenaOsobni}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-900/95">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-2">
              Žádné služby k dispozici
            </h2>
            <p className="text-gray-400">
              Služby budou brzy přidány.
            </p>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-900/95 via-neutral-800/95 to-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Jak to funguje?</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Jednoduchý proces od rezervace po dokončení servisu
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className={`text-center animate-fadeInUp stagger-${index + 1}`}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg hover:shadow-orange-500/50 transform hover:scale-110 transition-all duration-300">
                    {index + 1}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-orange-500 to-transparent"></div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white hover:gradient-text transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Table Section */}
      {pricingTable.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-neutral-800 via-neutral-800/95 to-neutral-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              <span className="gradient-text">Ceník služeb</span>
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              Přehledný ceník všech našich služeb
            </p>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-red-600">
                      <th className="px-6 py-4 text-left text-white font-bold">Služba</th>
                      <th className="px-6 py-4 text-left text-white font-bold">Osobní auto</th>
                      <th className="px-6 py-4 text-left text-white font-bold">SUV/Dodávka</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingTable.map((item, index) => (
                      <tr key={index} className="border-b border-gray-700 hover:bg-white/5 transition-colors duration-300">
                        <td className="px-6 py-4 text-gray-300 font-semibold">{item.service}</td>
                        <td className="px-6 py-4 text-gray-400">{item.car}</td>
                        <td className="px-6 py-4 text-gray-400">{item.suv}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-gray-500 text-sm text-center mt-8">
              * Ceny jsou orientační a mohou se lišit podle konkrétního vozidla a rozsahu práce.
            </p>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-orange-500 via-red-600 to-brown-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Zaujala vás některá služba?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rezervujte si termín ještě dnes a získejte profesionální servis!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Rezervovat termín
            </Link>
            <a
              href="tel:+420602299090"
              className="px-8 py-4 bg-neutral-900 text-white rounded-lg font-bold text-lg hover:bg-neutral-800 transition-all duration-300 shadow-xl"
            >
              Zavolat nyní
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
