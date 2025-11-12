'use client';

import { useEffect, useState } from 'react';

interface OpeningHour {
  id: string;
  den: string;
  hodiny: string;
  poradi: number;
  aktivni: boolean;
}

export default function KontaktyPage() {
  const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOpeningHours();
  }, []);

  const loadOpeningHours = async () => {
    try {
      const response = await fetch('/api/oteviraci-doba');
      const data = await response.json();
      setOpeningHours(data.hours || []);
    } catch (error) {
      console.error('Chyba při načítání otevírací doby:', error);
    } finally {
      setLoading(false);
    }
  };
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
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 animate-fadeInUp">
            <span className="gradient-text">Kontaktujte nás</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fadeInUp stagger-2">
            Jsme tu pro vás! Kontaktujte nás telefonicky, emailem nebo nás navštivte na našich pobočkách.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-900/95">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {/* Phone Card */}
            <div className="card hover-lift hover-glow group animate-fadeInUp stagger-1 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50 flex-shrink-0">
                  📞
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 gradient-text">Telefon</h3>
                  <a 
                    href="tel:+420602299090" 
                    className="text-gray-300 text-base hover:text-orange-500 transition-colors duration-300 hover:underline"
                  >
                    +420 602 299 090
                  </a>
                  <p className="text-gray-400 text-xs mt-1">
                    Volejte v pracovní dny 8:00 - 18:00
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="card hover-lift hover-glow group animate-fadeInUp stagger-2 p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50 flex-shrink-0">
                  ✉️
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1 gradient-text">Email</h3>
                  <a 
                    href="mailto:info@pneuservisvmk.cz" 
                    className="text-gray-300 text-base hover:text-orange-500 transition-colors duration-300 hover:underline break-all"
                  >
                    info@pneuservisvmk.cz
                  </a>
                  <p className="text-gray-400 text-xs mt-1">
                    Odpovíme do 24 hodin
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sídlo společnosti - Praha */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text vlevo */}
              <div className="card hover-glow animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  🏢 Sídlo společnosti
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">VMK Consulting Group s.r.o.</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Dandova 2619/13
                      <br />
                      193 00 Praha 9
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm mb-1">
                      <span className="font-semibold text-gray-300">IČO:</span> 193 81 735
                    </p>
                    <p className="text-gray-400 text-sm">
                      Zapsána v obchodním rejstříku vedeným Krajským soudem v Praze
                      <br />
                      oddíl C, vložka 385168
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa vpravo */}
              <div className="card h-full min-h-[500px] p-0 overflow-hidden hover-glow group">
                <div className="relative w-full h-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2558.8210618104886!2d14.618882275891774!3d50.10835617152879!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470bf2ea7d7dcfb1%3A0x7b14ff945d6f453!2sDandova%202619%2F13%2C%20193%2000%20Horn%C3%AD%20Po%C4%8Dernice!5e0!3m2!1scs!2scz!4v1762980448035!5m2!1scs!2scz" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '500px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa - Sídlo společnosti Praha"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Provozovna - Chrast */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Text vlevo */}
              <div className="card hover-glow animate-fadeInUp">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  🔧 Provozovna / Výdejní místo
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Pneuservis VMK</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Osady Ležáků 835
                      <br />
                      538 51 Chrast
                    </p>
                  </div>
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-gray-400 text-sm">
                      Zde najdete naši provozovnu, kde provádíme veškeré služby
                      <br />
                      související s pneumatikami a koly.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa vpravo */}
              <div className="card h-full min-h-[500px] p-0 overflow-hidden hover-glow group">
                <div className="relative w-full h-full">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2569.990958198211!2d15.92763977587662!3d49.89897307149216!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470db86d15207add%3A0xe0f6ed5abccb02fa!2zT3NhZHkgTGXFvsOha8WvIDgzNSwgNTM4IDUxIENocmFzdCB1IENocnVkaW3Emw!5e0!3m2!1scs!2scz!4v1762978379120!5m2!1scs!2scz" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '500px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa - Provozovna Chrast"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opening Hours Section */}
      <section className="py-12 pb-16 bg-gradient-to-b from-neutral-900 to-neutral-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="card hover-glow animate-fadeInUp">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                🕐
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold mb-6 gradient-text">Otevírací doba</h3>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {openingHours.map((day, index) => (
                      <div 
                        key={day.id} 
                        className={`flex justify-between items-center py-4 px-3 rounded-lg transition-colors hover:bg-white/5 ${
                          index < openingHours.length - 1 ? 'border-b border-gray-800' : ''
                        }`}
                      >
                        <span className="font-semibold text-white">{day.den}</span>
                        <span className="text-gray-400">{day.hodiny}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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
            Máte dotaz nebo zájem o službu?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Neváhejte nás kontaktovat telefonicky nebo emailem. Rádi vám odpovíme na všechny vaše dotazy!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+420602299090"
              className="px-8 py-4 bg-white text-orange-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              📞 Zavolat nyní
            </a>
            <a
              href="mailto:info@pneuservisvmk.cz"
              className="px-8 py-4 bg-neutral-900 text-white rounded-lg font-bold text-lg hover:bg-neutral-800 transition-all duration-300 shadow-xl"
            >
              ✉️ Napsat email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
