import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'O nás',
  description: 'Seznamte se s PneuservisVMK - náš příběh, zkušenosti a hodnoty, které nás vedou.',
};

const stats = [
  { value: '15+', label: 'Let zkušeností' },
  { value: '10K+', label: 'Spokojených zákazníků' },
  { value: '25K+', label: 'Vyměněných pneumatik' },
  { value: '4.9', label: 'Hodnocení' },
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

const values = [
  {
    icon: '🎯',
    title: 'Kvalita',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    icon: '🤝',
    title: 'Důvěra',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    icon: '💡',
    title: 'Inovace',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
];

const team = [
  {
    icon: '👨‍🔧',
    name: 'Jan Novák',
    position: 'Majitel & Hlavní mechanik',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
  },
  {
    icon: '👨‍🔧',
    name: 'Petr Dvořák',
    position: 'Mechanik',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
  },
  {
    icon: '👩‍💼',
    name: 'Marie Svobodová',
    position: 'Recepční & Administrativa',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor.',
  },
];

export default function ONasPage() {
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
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f]/80 to-[#0f0f0f]/98">
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
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-bg-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-600 rounded-full blur-3xl animate-bg-float-delayed"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fadeInUp">
            <span className="gradient-text">O nás</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp stagger-2">
            Zjistěte více o našem příběhu a našich hodnotách.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a]/98 via-[#1a1a1a] to-[#0f0f0f]/95">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeInUp">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="gradient-text">Náš příběh</span>
              </h2>
              <div className="space-y-4 text-gray-300 text-lg leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                </p>
              </div>
            </div>
            <div className="animate-fadeInUp stagger-2">
              <div className="card p-0 overflow-hidden hover-glow">
                <img 
                  src="/uploads/HomePageBackground.png" 
                  alt="PneuservisVMK Workshop" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a]/95 via-[#1a1a1a]/90 to-[#0a0a0a]/95">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Naše úspěchy</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={`text-center hover-glow cursor-pointer animate-fadeInUp stagger-${index + 1}`}>
                <div className="text-5xl md:text-6xl font-black gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium hover:text-gray-300 transition-colors duration-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-gradient-to-b from-[#1a1a1a]/95 via-[#0f0f0f] to-[#0a0a0a]/90">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Proč si vybrat nás?</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((reason, index) => (
              <div key={index} className={`text-center p-6 hover-glow cursor-pointer animate-fadeInUp stagger-${index + 1}`}>
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-4xl transition-all duration-300 shadow-lg hover:shadow-orange-500/50">
                  {reason.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-white hover:gradient-text transition-all duration-300">{reason.title}</h3>
                <p className="text-gray-400 text-sm hover:text-gray-300 transition-colors duration-300">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-b from-[#1a1a1a]/90 via-[#0f0f0f]/95 to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            <span className="gradient-text">Naše hodnoty</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className={`card group hover-glow cursor-pointer animate-fadeInUp stagger-${index + 1}`}
              >
                <div className="text-5xl mb-4 transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3 gradient-text group-hover:tracking-wide transition-all duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a] to-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="gradient-text">Náš tým</span>
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className={`card group hover-glow text-center cursor-pointer animate-fadeInUp stagger-${index + 1}`}
              >
                <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-6xl transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50">
                  {member.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 gradient-text group-hover:tracking-wide transition-all duration-300">
                  {member.name}
                </h3>
                <p className="text-orange-500 font-semibold mb-3">{member.position}</p>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
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
            Připojte se k našim spokojeným zákazníkům
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rezervujte termín ještě dnes!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/rezervace"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              Rezervovat termín
            </a>
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
