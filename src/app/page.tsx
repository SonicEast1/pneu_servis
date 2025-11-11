import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Domů',
  description: 'Profesionální pneuservis s dlouholetou tradicí. Výměna pneumatik, vyvážení kol, uskladnění pneu a kompletní servis.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/uploads/HomePageBackground.png" 
            alt="PneuservisVMK Workshop" 
            className="w-full h-full object-cover"
          />
          {/* Dark overlay pro čitelnost textu */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#3D1F1F]/80 via-[#2A1414]/70 to-[#3D1F1F]/90"></div>
          {/* Barevné akcenty */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
          </div>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp stagger-3">
            <Link href="/rezervace" className="btn-primary text-lg hover-lift">
              Rezervovat termín
            </Link>
            <a href="tel:+420123456789" className="btn-secondary text-lg hover-lift">
              +420 123 456 789
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-orange-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-900 to-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Proč si vybrat nás?</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, index) => (
              <div key={index} className={`text-center p-6 hover-lift cursor-pointer animate-fadeInUp stagger-${index + 1}`}>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-4xl transform hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-orange-500/50">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white hover:gradient-text transition-all duration-300">{reason.title}</h3>
                <p className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-300">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center hover-scale cursor-pointer animate-fadeInUp stagger-${index + 1}`}>
                <div className="text-5xl md:text-6xl font-black gradient-text mb-2 hover:animate-pulse">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-orange-500 via-red-600 to-brown-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Potřebujete vyměnit pneumatiky?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rezervujte si termín ještě dnes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Rezervovat online
            </Link>
            <a
              href="tel:+420123456789"
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

const reasons = [
  {
    icon: '⭐',
    title: '15+ let zkušeností',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    icon: '⚡',
    title: 'Rychlá obsluha',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    icon: '💰',
    title: 'Férové ceny',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
  {
    icon: '✓',
    title: 'Záruka kvality',
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
  },
];

const stats = [
  { value: '15+', label: 'Let zkušeností' },
  { value: '10K+', label: 'Spokojených zákazníků' },
  { value: '25K+', label: 'Vyměněných pneumatik' },
  { value: '4.9', label: 'Hodnocení' },
];
