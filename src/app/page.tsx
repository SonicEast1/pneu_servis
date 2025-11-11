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

      {/* Services Section */}
      <section className="section-padding bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Naše služby</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`card group hover-lift hover-glow cursor-pointer animate-fadeInUp stagger-${(index % 6) + 1}`}
              >
                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 gradient-text group-hover:tracking-wide transition-all duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-sm transform group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                      <span className="text-orange-500 mr-2 group-hover:scale-125 transition-transform duration-300">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

      {/* Opening Hours */}
      <section className="section-padding bg-neutral-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="gradient-text">Otevírací doba</span>
          </h2>
          <div className="card max-w-2xl mx-auto">
            <div className="space-y-4">
              {openingHours.map((day, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0">
                  <span className="font-semibold text-white">{day.day}</span>
                  <span className="text-gray-400">{day.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const services = [
  {
    icon: '🔧',
    title: 'Výměna pneumatik',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rychlá a profesionální výměna.',
    features: ['Osobní auta', 'SUV a dodávky', 'Motocykly'],
  },
  {
    icon: '⚖️',
    title: 'Vyvážení kol',
    description: 'Lorem ipsum dolor sit amet. Precizní vyvážení na moderním zařízení pro klidnou jízdu.',
    features: ['Dynamické vyvážení', 'Statické vyvážení', 'Kontrola geometrie'],
  },
  {
    icon: '📦',
    title: 'Uskladnění pneu',
    description: 'Lorem ipsum dolor sit amet. Skladujeme vaše pneumatiky v optimálních podmínkách.',
    features: ['Suché prostory', 'Označení a evidence', 'Pojištění'],
  },
  {
    icon: '🔨',
    title: 'Oprava pneumatik',
    description: 'Lorem ipsum dolor sit amet. Odborná oprava defektů a poškozených pneumatik.',
    features: ['Oprava propíchnutí', 'Těsnění ventilků', 'Kontrola tlaku'],
  },
  {
    icon: '🛒',
    title: 'Prodej pneumatik',
    description: 'Lorem ipsum dolor sit amet. Široký sortiment pneumatik všech značek a rozměrů.',
    features: ['Letní pneumatiky', 'Zimní pneumatiky', 'Celoroční pneumatiky'],
  },
  {
    icon: '🚗',
    title: 'Kompletní servis',
    description: 'Lorem ipsum dolor sit amet. Kompletní péče o vaše kola a pneumatiky.',
    features: ['Kontrola opotřebení', 'Dohuštění', 'Poradenství'],
  },
];

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

const openingHours = [
  { day: 'Pondělí', hours: '8:00 - 18:00' },
  { day: 'Úterý', hours: '8:00 - 18:00' },
  { day: 'Středa', hours: '8:00 - 18:00' },
  { day: 'Čtvrtek', hours: '8:00 - 18:00' },
  { day: 'Pátek', hours: '8:00 - 18:00' },
  { day: 'Sobota', hours: '9:00 - 14:00' },
  { day: 'Neděle', hours: 'Zavřeno' },
];
