'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';

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

const processSteps = [
  { title: 'Rezervace', description: 'Zarezervujte si termín online nebo zavolejte — rychle a bez čekání.' },
  { title: 'Příjezd', description: 'Přijeďte v domluvený čas. Přijmeme váš vůz a domluvíme podrobnosti.' },
  { title: 'Servis', description: 'Profesionální přezutí nebo vyvážení na kalibrovaných strojích.' },
  { title: 'Platba', description: 'Transparentní cena dle ceníku, platba v hotovosti nebo kartou.' },
];

export default function SluzbyPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sluzby')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <TechBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[var(--accent)] mx-auto mb-4" />
            <p className="text-theme-secondary">Načítám služby...</p>
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
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Služby & Ceník</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-5 animate-fadeInUp stagger-1">
            Naše <span className="gradient-tech">služby</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-2xl mx-auto animate-fadeInUp stagger-2">
            Kompletní přehled služeb a cen. Profesionální péče o vaše pneumatiky a kola.
          </p>
        </div>
      </section>

      {/* Service Cards */}
      {services.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <p className="section-tag">Co nabízíme</p>
              <h2 className="section-title text-3xl sm:text-4xl font-bold">Přehled služeb</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service, index) => (
                <div key={service.id} className={`tech-panel animate-fadeInUp stagger-${(index % 4) + 1}`}>
                  <div className="text-4xl mb-4">{service.ikona}</div>
                  <h3 className="font-display text-xl font-bold text-theme mb-2">{service.nazev}</h3>
                  <p className="text-theme-secondary text-sm mb-4">{service.popis}</p>
                  {service.features && (
                    <ul className="space-y-1.5 mb-5">
                      {service.features.split(';').map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-theme-secondary text-sm">
                          <span className="text-accent font-bold">✓</span>
                          {f.trim()}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="pt-4 border-t border-theme flex items-center justify-between">
                    <span className="text-theme-muted text-xs font-semibold uppercase tracking-wide">Cena od</span>
                    <span className="font-display text-xl font-bold text-accent">{service.cenaOsobni}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="border-y border-theme bg-surface-alt py-16 lg:py-20 transition-colors duration-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-tag justify-center">Jak to funguje</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold">
              Od rezervace po dokončení
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <div key={index} className={`animate-fadeInUp stagger-${index + 1}`}>
                <div className="relative mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent flex items-center justify-center text-white font-display font-bold text-xl rounded-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute left-12 top-6 w-full h-0.5 bg-[var(--border-strong)]" />
                  )}
                </div>
                <h3 className="font-display text-lg font-bold text-theme mb-2">{step.title}</h3>
                <p className="text-theme-secondary text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tables */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="section-tag">Ceník</p>
            <h2 className="section-title text-3xl sm:text-4xl font-bold mb-2">Ceník služeb</h2>
            <p className="text-theme-secondary text-sm">
              Ceny za 1 ks, v Kč vč. DPH · Platnost od 1. 10. 2025
            </p>
          </div>

          {/* SERVISNÍ PAKETY */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
              <div>
                <h3 className="font-display text-lg font-bold text-theme">Servisní pakety</h3>
                <p className="text-theme-muted text-xs">Cena za 1 ks (Kč vč. DPH)</p>
              </div>
              <p className="text-theme-muted text-xs">Velikosti: R12–R24, VAN/SUV 15&quot;–17&quot;, SUV/Offroad 18&quot;+</p>
            </div>
            <div className="price-table-wrap overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="min-w-[160px]">Služba</th>
                    <th className="min-w-[200px]">Popis</th>
                    <th>R12</th><th>R13</th><th>R14</th><th>R15</th><th>R16</th><th>R17</th>
                    <th>R18</th><th>R19</th><th>R20</th><th>R21</th><th>R22</th><th>R23</th><th>R24</th>
                    <th className="min-w-[100px]">VAN/SUV 15&quot;–17&quot;</th>
                    <th className="min-w-[100px]">SUV/Offroad 18&quot;+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Set 1 – KOMPLETNÍ PŘEZUTÍ</td>
                    <td className="text-theme-secondary">výměna kola z osy na osu, výměna pneu, vyvážení, závaží, ventil</td>
                    <td>170 Kč</td><td>185 Kč</td><td>200 Kč</td><td>225 Kč</td><td>250 Kč</td><td>300 Kč</td>
                    <td>325 Kč</td><td>350 Kč</td><td>375 Kč</td><td>400 Kč</td><td>425 Kč</td><td>450 Kč</td><td>500 Kč</td>
                    <td>375 Kč</td><td>425 Kč</td>
                  </tr>
                  <tr>
                    <td>Set 2 – VÝMĚNA KOLA + VYVÁŽENÍ</td>
                    <td className="text-theme-secondary">výměna kola z osy na osu, vyvážení, závaží</td>
                    <td>115 Kč</td><td>125 Kč</td><td>125 Kč</td><td>150 Kč</td><td>165 Kč</td><td>205 Kč</td>
                    <td>220 Kč</td><td>235 Kč</td><td>250 Kč</td><td>265 Kč</td><td>280 Kč</td><td>295 Kč</td><td>335 Kč</td>
                    <td>225 Kč</td><td>255 Kč</td>
                  </tr>
                  <tr>
                    <td>Set 3 – VÝMĚNA KOLA</td>
                    <td className="text-theme-secondary">výměna kola z osy na osu, bez vyvážení</td>
                    <td>50 Kč</td><td>65 Kč</td><td>75 Kč</td><td>75 Kč</td><td>85 Kč</td><td>95 Kč</td>
                    <td>105 Kč</td><td>110 Kč</td><td>115 Kč</td><td>120 Kč</td><td>130 Kč</td><td>130 Kč</td><td>130 Kč</td>
                    <td>115 Kč</td><td>125 Kč</td>
                  </tr>
                  <tr>
                    <td>Set 4 – VÝMĚNA PNEU + VYVÁŽENÍ</td>
                    <td className="text-theme-secondary">výměna pneu, vyvážení, závaží, ventil</td>
                    <td>120 Kč</td><td>140 Kč</td><td>150 Kč</td><td>175 Kč</td><td>190 Kč</td><td>205 Kč</td>
                    <td>220 Kč</td><td>240 Kč</td><td>260 Kč</td><td>270 Kč</td><td>280 Kč</td><td>290 Kč</td><td>300 Kč</td>
                    <td>260 Kč</td><td>300 Kč</td>
                  </tr>
                  <tr>
                    <td>Set 5 – MONTÁŽ PNEU + VYVÁŽENÍ</td>
                    <td className="text-theme-secondary">montáž pneu na disk, vyvážení, ventil, závaží</td>
                    <td>95 Kč</td><td>100 Kč</td><td>110 Kč</td><td>125 Kč</td><td>135 Kč</td><td>145 Kč</td>
                    <td>155 Kč</td><td>165 Kč</td><td>175 Kč</td><td>185 Kč</td><td>195 Kč</td><td>205 Kč</td><td>215 Kč</td>
                    <td>180 Kč</td><td>205 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DALŠÍ SLUŽBY */}
          <div className="mb-10">
            <div className="mb-3">
              <h3 className="font-display text-lg font-bold text-theme">Další služby</h3>
              <p className="text-theme-muted text-xs">Cena za 1 ks (Kč vč. DPH)</p>
            </div>
            <div className="price-table-wrap overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th className="min-w-[160px]">Služba</th>
                    <th className="min-w-[200px]">Popis</th>
                    <th>R12</th><th>R13</th><th>R14</th><th>R15</th><th>R16</th><th>R17</th>
                    <th>R18</th><th>R19</th><th>R20</th><th>R21</th><th>R22</th><th>R23</th><th>R24</th>
                    <th className="min-w-[100px]">VAN/SUV 15&quot;–17&quot;</th>
                    <th className="min-w-[100px]">SUV/Offroad 18&quot;+</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Set 3 – VÝMĚNA KOLA</td>
                    <td className="text-theme-secondary">výměna kola z osy na osu, bez vyvážení</td>
                    <td>50 Kč</td><td>55 Kč</td><td>60 Kč</td><td>65 Kč</td><td>75 Kč</td><td>90 Kč</td>
                    <td>95 Kč</td><td>100 Kč</td><td>105 Kč</td><td>110 Kč</td><td>115 Kč</td><td>120 Kč</td><td>125 Kč</td>
                    <td>105 Kč</td><td>115 Kč</td>
                  </tr>
                  <tr>
                    <td>VÝMĚNA PNEU</td>
                    <td className="text-theme-secondary">výměna pneu na disku, ventil, bez vyvážení</td>
                    <td>55 Kč</td><td>60 Kč</td><td>65 Kč</td><td>75 Kč</td><td>80 Kč</td><td>100 Kč</td>
                    <td>110 Kč</td><td>120 Kč</td><td>130 Kč</td><td>140 Kč</td><td>150 Kč</td><td>160 Kč</td><td>190 Kč</td>
                    <td>130 Kč</td><td>150 Kč</td>
                  </tr>
                  <tr>
                    <td>VYVÁŽENÍ KOLA</td>
                    <td className="text-theme-secondary">vč. závaží</td>
                    <td>65 Kč</td><td>70 Kč</td><td>75 Kč</td><td>85 Kč</td><td>95 Kč</td><td>110 Kč</td>
                    <td>120 Kč</td><td>130 Kč</td><td>140 Kč</td><td>150 Kč</td><td>160 Kč</td><td>170 Kč</td><td>185 Kč</td>
                    <td>140 Kč</td><td>160 Kč</td>
                  </tr>
                  <tr>
                    <td>MONTÁŽ PNEU</td>
                    <td className="text-theme-secondary">vč. ventilku, bez vyvážení</td>
                    <td>30 Kč</td><td>35 Kč</td><td>35 Kč</td><td>40 Kč</td><td>45 Kč</td><td>55 Kč</td>
                    <td>60 Kč</td><td>65 Kč</td><td>70 Kč</td><td>75 Kč</td><td>80 Kč</td><td>85 Kč</td><td>100 Kč</td>
                    <td>70 Kč</td><td>80 Kč</td>
                  </tr>
                  <tr>
                    <td>DEMONTÁŽ PNEU</td>
                    <td className="text-theme-secondary">demontáž pneu z disku</td>
                    <td>25 Kč</td><td>25 Kč</td><td>30 Kč</td><td>35 Kč</td><td>35 Kč</td><td>45 Kč</td>
                    <td>50 Kč</td><td>55 Kč</td><td>60 Kč</td><td>65 Kč</td><td>70 Kč</td><td>75 Kč</td><td>90 Kč</td>
                    <td>60 Kč</td><td>70 Kč</td>
                  </tr>
                  <tr>
                    <td>MYTÍ KOLA</td>
                    <td className="text-theme-secondary">R12–SUV/Offroad</td>
                    <td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td>
                    <td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td><td>25 Kč</td>
                    <td>25 Kč</td><td>25 Kč</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DOPLŇKOVÉ SLUŽBY */}
          <div>
            <div className="mb-3">
              <h3 className="font-display text-lg font-bold text-theme">Ostatní doplňkové služby</h3>
            </div>
            <div className="price-table-wrap overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th>Služba</th>
                    <th>Popis</th>
                    <th>Cena</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>OPRAVA PNEU</td><td className="text-theme-secondary">vč. materiálu i práce s pneu</td><td>300 Kč</td></tr>
                  <tr><td>PŘÍPLATEK ZA RUNFLAT PNEU</td><td className="text-theme-secondary"></td><td>75 Kč</td></tr>
                  <tr><td>TPMS – montáž/demontáž senzoru</td><td className="text-theme-secondary">/ ks</td><td>25 Kč</td></tr>
                  <tr><td>TPMS – programování/spárování senzoru</td><td className="text-theme-secondary">/ vozidlo</td><td>250 Kč</td></tr>
                  <tr><td>TPMS – kontrola senzorů</td><td className="text-theme-secondary">/ vozidlo</td><td>80 Kč</td></tr>
                  <tr><td>TPMS – aktivace přímého systému měření</td><td className="text-theme-secondary">/ vozidlo</td><td>80 Kč</td></tr>
                  <tr><td>Odvoz pneumatiky k likvidaci</td><td className="text-theme-secondary">/ ks</td><td>50 Kč</td></tr>
                  <tr><td>Ostatní mechanické práce</td><td className="text-theme-secondary">účtováno po ½ hodiny</td><td>500 Kč/hod</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band py-20 lg:py-28">
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <p className="section-tag justify-center mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Zaujala vás některá služba?
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Rezervujte si termín ještě dnes
          </h2>
          <p className="text-lg mb-10 opacity-75">
            Profesionální servis na počkání. Online rezervace do 2 minut.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rezervace" className="btn-tech-primary">
              Rezervovat termín
            </Link>
            <a
              href={`tel:${CONTACT_INFO.phone.raw}`}
              className="btn-tech-secondary"
              style={{ color: '#f0ede6', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              Zavolat nyní
            </a>
          </div>
        </div>
      </section>
    </TechBackground>
  );
}
