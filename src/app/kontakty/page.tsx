import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakty',
  description: 'Kontaktní informace PneuservisVMK - adresa, telefon, otevírací doba a mapa.',
};

const openingHours = [
  { day: 'Pondělí', hours: '8:00 - 18:00' },
  { day: 'Úterý', hours: '8:00 - 18:00' },
  { day: 'Středa', hours: '8:00 - 18:00' },
  { day: 'Čtvrtek', hours: '8:00 - 18:00' },
  { day: 'Pátek', hours: '8:00 - 18:00' },
  { day: 'Sobota', hours: '9:00 - 14:00' },
  { day: 'Neděle', hours: 'Zavřeno' },
];

export default function KontaktyPage() {
  return (
    <div className="min-h-screen bg-neutral-900">
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rádi vám poradíme a odpovíme na vaše dotazy.
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="section-padding bg-neutral-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Cards */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="card hover-lift hover-glow group animate-fadeInUp stagger-1">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50 flex-shrink-0">
                    📍
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 gradient-text">Adresa</h3>
                    <p className="text-gray-300 leading-relaxed">
                      Lorem Ipsum Street 123
                      <br />
                      456 78 Dolor Sit Amet
                      <br />
                      Česká republika
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="card hover-lift hover-glow group animate-fadeInUp stagger-2">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50 flex-shrink-0">
                    📞
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 gradient-text">Telefon</h3>
                    <a 
                      href="tel:+420123456789" 
                      className="text-gray-300 text-xl hover:text-orange-500 transition-colors duration-300 hover:underline"
                    >
                      +420 123 456 789
                    </a>
                    <p className="text-gray-400 text-sm mt-2">
                      Volejte v pracovní dny 8:00 - 18:00
                    </p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="card hover-lift hover-glow group animate-fadeInUp stagger-3">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl transform group-hover:rotate-12 transition-all duration-300 shadow-lg group-hover:shadow-orange-500/50 flex-shrink-0">
                    ✉️
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 gradient-text">Email</h3>
                    <a 
                      href="mailto:info@pneuservisvmk.cz" 
                      className="text-gray-300 text-xl hover:text-orange-500 transition-colors duration-300 hover:underline break-all"
                    >
                      info@pneuservisvmk.cz
                    </a>
                    <p className="text-gray-400 text-sm mt-2">
                      Odpovíme do 24 hodin
                    </p>
                  </div>
                </div>
              </div>

              {/* Opening Hours Card */}
              <div className="card hover-glow animate-fadeInUp stagger-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg flex-shrink-0">
                    🕐
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 gradient-text">Otevírací doba</h3>
                    <div className="space-y-2">
                      {openingHours.map((day, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                          <span className="font-semibold text-white">{day.day}</span>
                          <span className="text-gray-400">{day.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="animate-fadeInUp stagger-2">
              <div className="card h-full min-h-[600px] p-0 overflow-hidden hover-glow group">
                <div className="relative w-full h-full">
                  {/* Placeholder pro mapu - zde můžete vložit iframe s Google Maps */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
                    <div className="text-center p-8">
                      <div className="text-6xl mb-4">🗺️</div>
                      <h3 className="text-2xl font-bold gradient-text mb-3">Místo pro mapu</h3>
                      <p className="text-gray-400 max-w-md">
                        Zde bude iframe s Google Maps. <br />
                        Vložte váš iframe kód níže:
                      </p>
                      <div className="mt-6 text-left bg-neutral-950 p-4 rounded-lg">
                        <code className="text-xs text-gray-500 break-all">
                          {`<iframe src="YOUR_MAP_URL" width="100%" height="600" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`}
                        </code>
                      </div>
                    </div>
                  </div>
                  
                  {/* Uncomment and add your iframe here: */}
                  {/* 
                  <iframe 
                    src="YOUR_GOOGLE_MAPS_EMBED_URL"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, minHeight: '600px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa PneuservisVMK"
                  />
                  */}
                </div>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Neváhejte nás kontaktovat!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+420123456789"
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
