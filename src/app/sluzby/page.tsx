import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Služby',
  description: 'Kompletní přehled služeb PneuservisVMK - výměna pneumatik, vyvážení, uskladnění, opravy a mnoho dalšího.',
};

const mainServices = [
  {
    icon: '🔧',
    title: 'Výměna pneumatik',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rychlá a profesionální výměna.',
    features: ['Osobní auta', 'SUV a dodávky', 'Motocykly', 'Kontrola tlaku'],
    price: '400 Kč',
  },
  {
    icon: '⚖️',
    title: 'Vyvážení kol',
    description: 'Lorem ipsum dolor sit amet. Precizní vyvážení na moderním zařízení pro klidnou jízdu.',
    features: ['Dynamické vyvážení', 'Statické vyvážení', 'Kontrola geometrie', 'Diagnostika vibrací'],
    price: '150 Kč',
  },
  {
    icon: '📦',
    title: 'Uskladnění pneu',
    description: 'Lorem ipsum dolor sit amet. Skladujeme vaše pneumatiky v optimálních podmínkách.',
    features: ['Suché prostory', 'Označení a evidence', 'Pojištění', 'Mytí před uskladněním'],
    price: '600 Kč/sezóna',
  },
  {
    icon: '🔨',
    title: 'Oprava pneumatik',
    description: 'Lorem ipsum dolor sit amet. Odborná oprava defektů a poškozených pneumatik.',
    features: ['Oprava propíchnutí', 'Těsnění ventilků', 'Kontrola tlaku', 'Záplaty zevnitř'],
    price: '200 Kč',
  },
  {
    icon: '🛒',
    title: 'Prodej pneumatik',
    description: 'Lorem ipsum dolor sit amet. Široký sortiment pneumatik všech značek a rozměrů.',
    features: ['Letní pneumatiky', 'Zimní pneumatiky', 'Celoroční pneumatiky', 'Prémiové značky'],
    price: 'Od 1500 Kč',
  },
  {
    icon: '🚗',
    title: 'Kompletní servis',
    description: 'Lorem ipsum dolor sit amet. Kompletní péče o vaše kola a pneumatiky.',
    features: ['Kontrola opotřebení', 'Dohuštění', 'Poradenství', 'Sezonní prohlídka'],
    price: '500 Kč',
  },
];

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

const pricingTable = [
  {
    service: 'Přezutí pneumatik (4 ks)',
    car: '400 Kč',
    suv: '600 Kč',
  },
  {
    service: 'Vyvážení kol (4 ks)',
    car: '600 Kč',
    suv: '800 Kč',
  },
  {
    service: 'Uskladnění (sezóna)',
    car: '600 Kč',
    suv: '800 Kč',
  },
  {
    service: 'Oprava pneumatiky',
    car: '200 Kč',
    suv: '250 Kč',
  },
  {
    service: 'Výměna ventilku',
    car: '50 Kč/ks',
    suv: '50 Kč/ks',
  },
  {
    service: 'Mytí kol (4 ks)',
    car: '100 Kč',
    suv: '150 Kč',
  },
];

export default function SluzbyPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-neutral-800 to-neutral-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fadeInUp">
            <span className="gradient-text">Naše služby</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp stagger-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="section-padding bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
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
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300 text-sm transform group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                      <span className="text-orange-500 mr-2 group-hover:scale-125 transition-transform duration-300">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Cena od</span>
                    <span className="text-2xl font-bold gradient-text">{service.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-neutral-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Jak to funguje?</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
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
      <section className="section-padding bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Ceník služeb</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
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
            * Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ceny jsou orientační a mohou se lišit podle konkrétního vozidla.
          </p>
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
            Zaujala vás některá služba?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rezervujte si termín ještě dnes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Rezervovat termín
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
