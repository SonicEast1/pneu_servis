'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    car: '',
    note: '',
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookedSlots] = useState(['09:00', '10:30', '14:00']); // Demo booked slots

  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/rezervace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Rezervace byla úspěšně odeslána!\n\nID rezervace: ${data.reservation.id}\n\nBudeme vás kontaktovat na emailu ${formData.email} nebo telefonu ${formData.phone}.`);
        // Reset form
        setFormData({
          service: '',
          date: '',
          time: '',
          name: '',
          email: '',
          phone: '',
          car: '',
          note: '',
        });
        setStep(1);
      } else {
        alert(`❌ Chyba: ${data.error || 'Nepodařilo se vytvořit rezervaci'}`);
      }
    } catch (error) {
      console.error('Chyba při odesílání rezervace:', error);
      alert('❌ Nastala chyba při odesílání rezervace. Zkuste to prosím znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  const canProceed = (currentStep: number) => {
    if (currentStep === 1) return formData.service;
    if (currentStep === 2) return formData.date && formData.time;
    if (currentStep === 3) return formData.name && formData.email && formData.phone;
    return false;
  };

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
      <section className="section-padding bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f] relative overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="gradient-text">Online rezervace</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Rezervujte si termín jednoduše online!
          </p>
        </div>
      </section>

      <div className="w-full py-16 bg-gradient-to-b from-[#0a0a0a] via-[#1a1a1a] to-[#0f0f0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-12">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((s, index) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all ${
                  step >= s 
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                    : 'bg-[#1a1a1a] text-gray-400'
                }`}>
                  {step > s ? '✓' : s}
                </div>
                {index < 3 && (
                  <div className={`w-16 md:w-32 h-1 mx-2 transition-all ${
                    step > s ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-[#1a1a1a]'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="grid grid-cols-4 gap-4 md:gap-8 text-center max-w-3xl w-full">
              <div className="text-sm font-medium text-gray-400">Služba</div>
              <div className="text-sm font-medium text-gray-400">Termín</div>
              <div className="text-sm font-medium text-gray-400">Údaje</div>
              <div className="text-sm font-medium text-gray-400">Potvrzení</div>
            </div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="card max-w-4xl mx-auto animate-fadeInUp hover-glow">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold gradient-text mb-6">Vyberte službu</h2>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 mx-auto"></div>
                    <p className="text-gray-400 mt-4">Načítám služby...</p>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Žádné služby nejsou k dispozici</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services
                      .filter(s => s.aktivni)
                      .sort((a, b) => (a.poradi || 0) - (b.poradi || 0))
                      .map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: service.id })}
                          className={`p-6 rounded-xl border-2 transition-all text-left ${
                            formData.service === service.id
                              ? 'border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/30'
                              : 'border-orange-500/50 bg-transparent hover:border-orange-500 hover:bg-orange-500/5'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-3xl">{service.ikona}</span>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2">{service.nazev}</h3>
                              <p className="text-gray-400 text-sm mb-1">{service.popis}</p>
                              <p className="text-orange-500 font-semibold">{service.cenaOsobni}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Date & Time Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold gradient-text mb-6">Vyberte datum a čas</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Datum
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Čas
                  </label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => {
                      const isBooked = bookedSlots.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setFormData({ ...formData, time })}
                          className={`py-3 rounded-lg font-medium transition-all ${
                            isBooked
                              ? 'bg-transparent text-gray-600 border-2 border-gray-600 cursor-not-allowed'
                              : formData.time === time
                              ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white border-2 border-orange-500'
                              : 'bg-transparent text-orange-500 border-2 border-orange-500 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Personal Info */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold gradient-text mb-6">Vaše údaje</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Jméno a příjmení *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Jan Novák"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="jan@email.cz"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="+420 602 299 090"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Značka a model vozu
                  </label>
                  <input
                    type="text"
                    value={formData.car}
                    onChange={(e) => setFormData({ ...formData, car: e.target.value })}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Škoda Octavia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poznámka
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Jakékoliv speciální požadavky..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold gradient-text mb-6">Potvrzení rezervace</h2>
                
                <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Služba:</span>
                    <span className="font-semibold text-white">
                      {services.find(s => s.id === formData.service)?.nazev}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Datum:</span>
                    <span className="font-semibold text-white">
                      {new Date(formData.date).toLocaleDateString('cs-CZ')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Čas:</span>
                    <span className="font-semibold text-white">{formData.time}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Jméno:</span>
                    <span className="font-semibold text-white">{formData.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Email:</span>
                    <span className="font-semibold text-white">{formData.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Telefon:</span>
                    <span className="font-semibold text-white">{formData.phone}</span>
                  </div>
                  {formData.car && (
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Vozidlo:</span>
                      <span className="font-semibold text-white">{formData.car}</span>
                    </div>
                  )}
                  {formData.note && (
                    <div className="py-2">
                      <span className="text-gray-400">Poznámka:</span>
                      <p className="text-white mt-1">{formData.note}</p>
                    </div>
                  )}
                </div>

                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
                  <p className="text-sm text-gray-300">
                    📧 Potvrzení rezervace vám bude zasláno na email <strong>{formData.email}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 bg-transparent text-orange-500 border-2 border-orange-500 rounded-lg hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 hover:text-white transition-all duration-300"
                >
                  Zpět
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed(step)}
                  className={`flex-1 btn-primary ${
                    !canProceed(step) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Pokračovat
                </button>
              ) : (
                <button 
                  type="submit" 
                  disabled={submitting}
                  className={`flex-1 btn-primary ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Odesílám...' : 'Potvrdit rezervaci'}
                </button>
              )}
            </div>
          </form>
        </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Preferujete telefonickou rezervaci?
            </p>
            <a
              href="tel:+420602299090"
              className="inline-block btn-secondary"
            >
              📞 +420 602 299 090
            </a>
          </div>
        </div>
      </div>
      
      {/* Spacer pro odsazení od footeru */}
      <div className="mb-16"></div>
    </div>
  );
}

