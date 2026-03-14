'use client';

import Link from 'next/link';
import Image from 'next/image';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Načítám služby...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Background blur effect - celá stránka */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-600 rounded-full blur-3xl animate-bg-float-delayed"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-yellow-500/60 rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600/40 rounded-full blur-3xl animate-bg-float-delayed"></div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
        {/* Obrázek s pneumatikou přes celou šířku - lze změnit v kódu */}
        {/* ============================================ */}
        {/* ZDE MŮŽETE ZMĚNIT OBRÁZEK: přepište '/pictures_web/upImg2.jpg' na váš obrázek */}
        {/* ============================================ */}
        <div className="absolute inset-0 w-full h-full opacity-20 md:opacity-30 pointer-events-none z-5">
          <Image
            src="/pictures_web/upImg2.jpg"
            alt="Pneumatika"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
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
        <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className={`card group hover-glow cursor-pointer animate-fadeInUp stagger-${(index % 6) + 1}`}
                >
                  <div className="text-5xl mb-4 transition-all duration-300">
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
                          <span className="text-orange-500 mr-2 transition-all duration-300">✓</span>
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
        <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
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
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
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
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
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

      {/* Pricing Table Section - detailní ceník dle Excelu */}
      <section className="section-padding bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Ceník služeb</span>
          </h2>
          <p className="text-gray-400 text-center mb-4 max-w-2xl mx-auto">
            Ceník pneuservisu &ndash; ceny za 1 ks, v Kč vč. DPH.
          </p>
          <p className="text-gray-500 text-xs md:text-sm text-center mb-12">
            Platnost od 1.10.2025 &middot; Ceny jsou uvedeny včetně DPH 21%.
          </p>

          {/* SERVISNÍ PAKETY */}
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[0.18em] uppercase text-gray-200">
                  Servisní pakety
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-[0.18em]">
                  Cena za 1 ks (Kč vč. DPH)
                </p>
              </div>
              <p className="text-xs text-gray-500">
                Velikosti pneu: R12 &ndash; R24, VAN/SUV 15&quot;-17&quot;, SUV/Offroad 18&quot;+
              </p>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      <th className="px-3 py-2 text-left font-semibold w-[18%] min-w-[150px]">
                        Služba
                      </th>
                      <th className="px-3 py-2 text-left font-semibold w-[26%] min-w-[190px]">
                        Popis
                      </th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R12</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R13</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R14</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R15</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R16</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R17</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R18</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R19</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R20</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R21</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R22</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R23</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R24</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                        VAN/SUV 15&quot;-17&quot;
                      </th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                        SUV/Offroad 18&quot;+
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Set 1 - KOMPLETNÍ PŘEZUTÍ */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 1 - KOMPLETNÍ PŘEZUTÍ
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna kola z osy na osu, výměna pneu, vyvážení, závaží, ventil
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">170,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">185,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">200,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">225,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">250,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">300,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">325,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">350,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">375,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">400,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">425,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">450,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">500,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">375,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">425,00 Kč</td>
                    </tr>

                    {/* Set 2 - VÝMĚNA KOLA + VYVÁŽENÍ */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 2 - VÝMĚNA KOLA + VYVÁŽENÍ
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna kola z osy na osu, vyvážení, závaží
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">115,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">125,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">125,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">150,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">165,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">205,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">220,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">235,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">250,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">265,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">280,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">295,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">335,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">225,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">255,00 Kč</td>
                    </tr>

                    {/* Set 3 - VÝMĚNA KOLA */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 3 - VÝMĚNA KOLA
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna kola z osy na osu, bez vyvážení
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">50,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">85,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">95,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">105,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">110,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">115,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">120,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">115,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">125,00 Kč</td>
                    </tr>

                    {/* Set 4 - VÝMĚNA PNEU + VYVÁŽENÍ */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 4 - VÝMĚNA PNEU + VYVÁŽENÍ
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna pneu, vyvážení, závaží, ventil
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">120,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">140,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">150,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">175,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">190,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">205,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">220,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">240,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">260,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">270,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">280,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">290,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">300,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">260,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">300,00 Kč</td>
                    </tr>

                    {/* Set 5 - MONTÁŽ PNEU + VYVÁŽENÍ */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 5 - MONTÁŽ PNEU + VYVÁŽENÍ
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        montáž pneu na disk, vyvážení, ventil, závaží
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">95,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">100,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">110,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">125,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">135,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">145,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">155,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">165,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">175,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">185,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">195,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">205,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">215,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">180,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">205,00 Kč</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* DALŠÍ SLUŽBY */}
          <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[0.18em] uppercase text-gray-200">
                  Další služby
                </h3>
                <p className="text-xs text-gray-400 uppercase tracking-[0.18em]">
                  Cena za 1 ks (Kč vč. DPH)
                </p>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] sm:text-xs md:text-sm leading-relaxed">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      <th className="px-3 py-2 text-left font-semibold w-[18%] min-w-[150px]">
                        Služba
                      </th>
                      <th className="px-3 py-2 text-left font-semibold w-[26%] min-w-[190px]">
                        Popis
                      </th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R12</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R13</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R14</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R15</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R16</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R17</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R18</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R19</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R20</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R21</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R22</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R23</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">R24</th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                        VAN/SUV 15&quot;-17&quot;
                      </th>
                      <th className="px-2 py-2 text-right font-semibold whitespace-nowrap">
                        SUV/Offroad 18&quot;+
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Set 3 - VÝMĚNA KOLA */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Set 3 - VÝMĚNA KOLA
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna kola z osy na osu, bez vyvážení
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">50,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">55,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">60,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">90,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">95,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">100,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">105,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">110,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">115,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">120,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">125,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">105,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">115,00 Kč</td>
                    </tr>

                    {/* VÝMĚNA PNEU */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        VÝMĚNA PNEU
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        výměna pneu na disku, ventil, bez vyvážení
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">55,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">60,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">80,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">100,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">110,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">120,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">140,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">150,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">160,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">190,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">150,00 Kč</td>
                    </tr>

                    {/* VYVÁŽENÍ KOLA */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        VYVÁŽENÍ KOLA
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        vč. závaží
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">70,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">85,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">95,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">110,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">120,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">130,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">140,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">150,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">160,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">170,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">185,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">140,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">160,00 Kč</td>
                    </tr>

                    {/* MONTÁŽ PNEU */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        MONTÁŽ PNEU
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        vč. ventilku, bez vyvážení
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">30,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">35,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">35,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">40,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">45,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">55,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">60,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">70,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">80,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">85,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">100,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">70,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">80,00 Kč</td>
                    </tr>

                    {/* DEMONTÁŽ PNEU */}
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        DEMONTÁŽ PNEU
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        demontáž pneu z disku
                      </td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">30,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">35,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">35,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">45,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">50,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">55,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">60,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">65,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">70,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">75,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">90,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-300">60,00 Kč</td>
                      <td className="px-2 py-2 text-right whitespace-nowrap text-orange-400 font-semibold">70,00 Kč</td>
                    </tr>

                    {/* MYTÍ KOLA */}
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        MYTÍ KOLA
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        R12&ndash;SUV/Offroad
                      </td>
                      {/* Pro R12&ndash;R24 a VAN/SUV ponecháno prázdné, cena platí obecně */}
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-300">25,00 Kč</td>
                      <td className="px-2 py-3 text-right text-orange-400 font-semibold">25,00 Kč</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* OSTATNÍ DOPLŇKOVÉ SLUŽBY */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold tracking-[0.18em] uppercase text-gray-200">
                  Ostatní doplňkové služby
                </h3>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-sm leading-snug">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                      <th className="px-3 py-2 text-left font-semibold">Služba</th>
                      <th className="px-3 py-2 text-left font-semibold">Popis</th>
                      <th className="px-3 py-2 text-right font-semibold whitespace-nowrap">Cena</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">OPRAVA PNEU</td>
                      <td className="px-3 py-2 text-gray-400">
                        vč. materiálu i práce s pneu
                      </td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        300,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        PŘÍPLATEK ZA SERVIS RUNFLAT PNEU
                      </td>
                      <td className="px-3 py-2 text-gray-400"></td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        75,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        TPMS - montáž/demontáž senzoru
                      </td>
                      <td className="px-3 py-2 text-gray-400">/ ks</td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        25,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        TPMS - programování/spárování senzoru
                      </td>
                      <td className="px-3 py-2 text-gray-400">/ vozidlo</td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        250,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        TPMS - kontrola senzorů
                      </td>
                      <td className="px-3 py-2 text-gray-400">/ vozidlo</td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        80,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        TPMS - aktivace přímého systému měření
                      </td>
                      <td className="px-3 py-2 text-gray-400">/ vozidlo</td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        80,00 Kč
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700/80 hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Odvoz pneumatiky k likvidaci
                      </td>
                      <td className="px-3 py-2 text-gray-400">/ ks</td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        50,00 Kč
                      </td>
                    </tr>
                    <tr className="hover:bg-white/5 transition-colors">
                      <td className="px-3 py-2 text-gray-200 font-semibold">
                        Ostatní mechanické práce
                      </td>
                      <td className="px-3 py-2 text-gray-400">
                        500,00 Kč / hod &ndash; účtováno po 1/2 hodiny dle skutečného času
                      </td>
                      <td className="px-3 py-2 text-right text-orange-400 font-semibold whitespace-nowrap">
                        500,00 Kč / hod
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding mb-16 bg-gradient-to-r from-orange-500 via-red-600 via-yellow-500 to-orange-600 relative overflow-hidden">
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
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Rezervovat termín
            </Link>
            <a
              href="tel:+420602299090"
              className="px-8 py-4 bg-[#0a0a0a] text-white rounded-lg font-bold text-lg hover:bg-[#1a1a1a] transition-all duration-300 shadow-xl border-2 border-white/30 hover:border-white/50"
            >
              Zavolat nyní
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
