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

export default function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('/api/sluzby');
      const data = await response.json();
      // Zobrazit pouze prvních 6 aktivních služeb
      const activeServices = (data.services || [])
        .filter((s: Service) => s.aktivni)
        .sort((a: Service, b: Service) => (a.poradi || 0) - (b.poradi || 0))
        .slice(0, 6);
      setServices(activeServices);
    } catch (error) {
      console.error('Chyba při načítání služeb:', error);
    }
  };

  return (
    <footer className="relative z-10 bg-[#0a0a0a] border-t border-orange-500/30 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10">
                <img 
                  src="/logoWeb.png" 
                  alt="PneuservisVMK Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold text-white">
                PneuservisVMK
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              Vždy nám na každém kole záleží. Profesionální péče o vaše pneumatiky s dlouholetou tradicí.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Rychlé odkazy</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Domů
                </Link>
              </li>
              <li>
                <Link href="/recenze" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Recenze
                </Link>
              </li>
              <li>
                <Link href="/rezervace" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Rezervace
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-gray-400 hover:text-orange-500 transition-all duration-300 hover:translate-x-1 inline-block">
                  Galerie
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Naše služby</h3>
            {services.length > 0 ? (
              <ul className="space-y-2 text-gray-400 text-sm">
                {services.map((service) => (
                  <li key={service.id}>{service.nazev}</li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Načítání služeb...</li>
              </ul>
            )}
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start space-x-2">
                <span>📍</span>
                <span>Osady Ležáků 835<br />538 51 Chrast</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span>
                <a href="tel:+420602299090" className="hover:text-orange-500 transition-colors">
                  +420 602 299 090
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>✉️</span>
                <a href="mailto:info@pneuservisvmk.cz" className="hover:text-orange-500 transition-colors">
                  info@pneuservisvmk.cz
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-orange-500/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PneuservisVMK. Všechna práva vyhrazena.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              Ochrana údajů
            </Link>
            <Link href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
              Podmínky
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
