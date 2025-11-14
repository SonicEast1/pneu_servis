import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domů',
  description: 'Profesionální pneuservis s dlouholetou tradicí. Výměna pneumatik, vyvážení kol, uskladnění pneu a kompletní servis.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          {/* Gradient background - tmavá černá/šedá */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]"></div>
          {/* Barevné akcenty */}
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-bg-float"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-bg-float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-yellow-500/40 rounded-full blur-3xl animate-bg-float"></div>
          </div>
        </div>

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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 animate-fadeInUp">
            <span className="gradient-text">PneuservisVMK</span>
            <br />
            <span className="text-white">Vždy nám na každém kole záleží</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fadeInUp stagger-2">
            Profesionální péče o vaše pneumatiky s důrazem na kvalitu a zákaznický servis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp stagger-3">
            <Link href="/rezervace" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-bold text-lg hover:shadow-xl hover:shadow-orange-500/70 transition-all duration-300 shadow-lg">
              Rezervovat termín
            </Link>
            <a href="tel:+420602299090" className="px-8 py-4 bg-transparent text-orange-500 border-2 border-orange-500 rounded-lg font-bold text-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white transition-all duration-300">
              +420 602 299 090
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-orange-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fadeInUp">
            <span className="gradient-text">Proč si vybrat nás?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, index) => (
              <div key={index} className={`text-center p-6 card hover-glow animate-fadeInUp stagger-${index + 1}`}>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 via-red-600 to-yellow-500 rounded-2xl flex items-center justify-center text-4xl transition-all duration-400 shadow-lg cursor-pointer">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white transition-all duration-300">{reason.title}</h3>
                <p className="text-gray-400 text-sm transition-colors duration-300">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding mb-16 bg-gradient-to-r from-orange-500 via-red-600 via-yellow-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-bg-float-delayed"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fadeInUp">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Potřebujete vyměnit pneumatiky?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rezervujte si termín ještě dnes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Rezervovat online
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

const reasons = [
  {
    icon: '⭐',
    title: '15+ let zkušeností',
    description: '',
  },
  {
    icon: '⚡',
    title: 'Rychlá obsluha',
    description: '',
  },
  {
    icon: '💰',
    title: 'Férové ceny',
    description: '',
  },
  {
    icon: '✓',
    title: 'Záruka kvality',
    description: '',
  },
];
