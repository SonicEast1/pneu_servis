'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import TechBackground from '@/components/TechBackground';
import { CONTACT_INFO } from '@/constants/contact';
import MascotCTA from '@/components/MascotCTA';
import { IconCheckCircle, IconPhone } from '@/components/Icons';
import type { Service } from '@/constants/services';
import { BOOKING_SLOT_MINUTES, WHEEL_SIZE_OPTIONS } from '@/constants/reservation';
import {
  bookingSlots,
  DEFAULT_OPENING_HOURS,
  pragueDate,
  type OpeningHour,
  type SpecialDay,
} from '@/lib/openingHours';

const stepLabels = ['Služba', 'Termín', 'Údaje', 'Potvrzení'];

const EMPTY_FORM = {
  service: '',
  date: '',
  time: '',
  name: '',
  email: '',
  phone: '',
  car: '',
  wheelSize: '',
  note: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function BookingPageContent() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [hours, setHours] = useState<OpeningHour[]>(DEFAULT_OPENING_HOURS);
  const [specials, setSpecials] = useState<SpecialDay[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  // Po odeslání posunout na kroky + potvrzení — formulář byl delší, jinak by zůstalo prázdno
  useEffect(() => {
    if (!done) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    progressRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [done]);

  useEffect(() => {
    fetch('/api/sluzby')
      .then((r) => r.json())
      .then((data) => setServices(data.services || []))
      .catch(() => {})
      .finally(() => setLoading(false));
    fetch('/api/oteviraci-doba')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.hours) && data.hours.length > 0) setHours(data.hours);
        setSpecials(data.specials || []);
      })
      .catch(() => {});
  }, []);

  // Obsazené časy pro vybraný den — bez osobních údajů, jen časy
  useEffect(() => {
    if (!formData.date) return;
    let cancelled = false;
    fetch(`/api/rezervace?obsazeno=${formData.date}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setBookedSlots(data.taken || []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [formData.date]);

  // Časy podle otevírací doby (včetně mimořádných dnů), ne natvrdo
  const timeSlots = formData.date ? bookingSlots(hours, specials, formData.date, BOOKING_SLOT_MINUTES) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/rezervace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setDone(true);
      } else {
        setError(data.error || 'Rezervaci se nepodařilo odeslat. Zkuste to prosím znovu.');
      }
    } catch {
      setError('Rezervaci se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu.');
    } finally {
      setSubmitting(false);
    }
  };

  const startOver = () => {
    setFormData(EMPTY_FORM);
    setStep(1);
    setDone(false);
  };

  // Povinné je vše kromě poznámky
  const canProceed = (s: number) => {
    if (s === 1) return !!formData.service;
    if (s === 2) return !!(formData.date && formData.time);
    if (s === 3) {
      return !!(
        formData.name.trim()
        && EMAIL.test(formData.email.trim())
        && formData.phone.replace(/\D/g, '').length >= 9
        && formData.car.trim()
        && formData.wheelSize
      );
    }
    return false;
  };

  return (
    <>
      <TechBackground>
      {/* Hero */}
      <section className="relative border-b border-theme py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <Image src="/pictures_web/hero_tire.png" alt="" fill className="object-cover" sizes="100vw" priority />
          <div className="absolute inset-0" style={{ background: 'var(--hero-overlay)' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-tag justify-center mb-4 animate-fadeInUp">Online rezervace</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-theme mb-4 animate-fadeInUp stagger-1">
            Rezervujte si <span className="gradient-tech">termín</span>
          </h1>
          <p className="text-theme-secondary text-lg max-w-xl mx-auto animate-fadeInUp stagger-2">
            Rychlá online rezervace do 2 minut.
          </p>
        </div>
      </section>

      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Progress Steps */}
          <div className="mb-10 scroll-mt-[calc(var(--header-h)+1.5rem)]" ref={progressRef}>
            <div className="flex items-center justify-center gap-0">
              {[1, 2, 3, 4].map((s, index) => (
                <div key={s} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 font-display font-bold text-sm transition-colors duration-200 border-2 ${
                    step >= s
                      ? 'bg-accent border-accent text-white'
                      : 'bg-transparent border-[var(--border-strong)] text-theme-muted'
                  }`}>
                    {step > s || done ? '✓' : s}
                  </div>
                  {index < 3 && (
                    <div className={`w-12 md:w-20 h-0.5 transition-colors duration-200 ${step > s || done ? 'bg-accent' : 'bg-[var(--border-strong)]'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-3">
              <div className="grid grid-cols-4 gap-2 md:gap-8 text-center max-w-sm w-full">
                {stepLabels.map((l, i) => (
                  <span key={i} className={`text-xs font-display font-semibold ${step === i + 1 ? 'text-accent' : 'text-theme-muted'}`}>{l}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Form Card */}
          {done ? (
            // Bez animate-fadeInUp: panel vzniká až po odeslání a scroll-reveal by ho mohl nechat skrytý
            <div className="tech-panel booking-done text-center py-10" role="status">
              <div className="icon-tile icon-tile-lg mx-auto mb-5">
                <IconCheckCircle />
              </div>
              <h2 className="font-display text-2xl font-bold text-theme mb-2">Rezervace byla odeslána</h2>
              <p className="text-theme-secondary max-w-md mx-auto mb-6">
                Vyčkejte prosím na potvrzení termínu {new Date(formData.date).toLocaleDateString('cs-CZ')} v {formData.time} telefonicky
                nebo e-mailem.
              </p>
              <button type="button" onClick={startOver} className="btn-tech-secondary">
                Nová rezervace
              </button>
            </div>
          ) : (
          <div className="tech-panel animate-fadeInUp">
            <form onSubmit={handleSubmit}>

              {/* Step 1: Service */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-theme mb-2">Vyberte službu</h2>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[var(--accent)] mx-auto" />
                      <p className="text-theme-muted mt-4 text-sm">Načítám služby...</p>
                    </div>
                  ) : services.length === 0 ? (
                    <p className="text-theme-muted text-center py-8">Žádné služby nejsou k dispozici</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {services.filter(s => s.aktivni).sort((a, b) => (a.poradi || 0) - (b.poradi || 0)).map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, service: service.id })}
                          className={`p-5 border-2 rounded text-left transition-[border-color,background-color,scale] duration-150 ease-[var(--ease-out-quint)] active:scale-[0.98] motion-reduce:active:scale-100 ${
                            formData.service === service.id
                              ? 'border-accent bg-[var(--accent-soft)]'
                              : 'border-[var(--border-strong)] hover:border-accent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{service.ikona}</span>
                            <div className="flex-1">
                              <h3 className="font-display font-bold text-theme mb-1">{service.nazev}</h3>
                              <p className="text-theme-secondary text-sm mb-1">{service.popis}</p>
                              <p className="text-accent font-bold text-sm">{service.cenaOsobni}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="font-display text-2xl font-bold text-theme mb-2">Vyberte datum a čas</h2>
                  <div>
                    <label className="form-label">Datum</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => {
                        setBookedSlots([]);
                        setFormData({ ...formData, date: e.target.value, time: '' });
                      }}
                      min={pragueDate()}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Čas</label>
                    {!formData.date && (
                      <p className="text-theme-muted text-sm mt-1">Nejdřív vyberte datum.</p>
                    )}
                    {formData.date && timeSlots.length === 0 && (
                      <p className="text-theme-secondary text-sm mt-1">
                        V tento den máme zavřeno nebo už nejsou volné časy. Vyberte prosím jiný den.
                      </p>
                    )}
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mt-1">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <button
                            key={time}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setFormData({ ...formData, time })}
                            className={`py-2.5 text-sm font-display font-semibold border-2 rounded transition-[color,border-color,background-color,scale] duration-150 ease-[var(--ease-out-quint)] enabled:active:scale-[0.96] motion-reduce:active:scale-100 ${
                              isBooked
                                ? 'border-[var(--border)] text-theme-muted cursor-not-allowed opacity-40'
                                : formData.time === time
                                ? 'bg-accent border-accent text-white'
                                : 'border-[var(--border-strong)] text-theme hover:border-accent hover:text-accent'
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
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-theme mb-2">Vaše údaje</h2>
                  <div>
                    <label className="form-label">Jméno a příjmení *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-input" placeholder="Jan Novák" required />
                  </div>
                  <div>
                    <label className="form-label">E-mail *</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-input" placeholder="jan@email.cz" required />
                  </div>
                  <div>
                    <label className="form-label">Telefon *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="form-input" placeholder="+420 602 299 090" required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label" htmlFor="booking-car">Značka a model vozu *</label>
                      <input id="booking-car" type="text" value={formData.car} onChange={(e) => setFormData({ ...formData, car: e.target.value })} className="form-input" placeholder="Škoda Octavia" required />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="booking-wheel">Rozměr kola *</label>
                      <select
                        id="booking-wheel"
                        value={formData.wheelSize}
                        onChange={(e) => setFormData({ ...formData, wheelSize: e.target.value })}
                        className="form-input"
                        required
                      >
                        <option value="" disabled>Vyberte rozměr</option>
                        {WHEEL_SIZE_OPTIONS.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                      <p className="text-theme-muted text-xs mt-1.5">Číslo za „R“ najdete na boku pneumatiky, např. 205/55 R16.</p>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Poznámka (nepovinné)</label>
                    <textarea value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} rows={3} className="form-input resize-none" placeholder="Jakékoliv speciální požadavky..." />
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-5">
                  <h2 className="font-display text-2xl font-bold text-theme mb-2">Potvrzení rezervace</h2>
                  <div className="bg-[var(--bg-elevated)] border border-theme rounded p-5 space-y-3">
                    {[
                      { label: 'Služba', value: services.find(s => s.id === formData.service)?.nazev },
                      { label: 'Datum', value: new Date(formData.date).toLocaleDateString('cs-CZ') },
                      { label: 'Čas', value: formData.time },
                      { label: 'Jméno', value: formData.name },
                      { label: 'E-mail', value: formData.email },
                      { label: 'Telefon', value: formData.phone },
                      { label: 'Vozidlo', value: formData.car },
                      { label: 'Rozměr kola', value: formData.wheelSize },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-start border-b border-theme pb-3 last:border-0 last:pb-0">
                        <span className="text-theme-muted text-sm font-semibold">{label}:</span>
                        <span className="font-display font-bold text-theme text-sm text-right">{value}</span>
                      </div>
                    ))}
                    {formData.note && (
                      <div className="border-t border-theme pt-3">
                        <span className="text-theme-muted text-sm block mb-1">Poznámka:</span>
                        <p className="text-theme text-sm">{formData.note}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-[var(--accent-soft)] border border-[var(--accent)] rounded p-4">
                    <p className="text-sm text-theme-secondary">
                      Termín vám potvrdíme telefonicky nebo e-mailem na <strong>{formData.email}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-6 text-sm text-accent" role="alert">{error}</p>
              )}

              {/* Navigation */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-theme">
                {step > 1 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn-tech-secondary px-6">
                    Zpět
                  </button>
                )}
                {/* Různé key → React nepřepoužije stejné tlačítko. Jinak by se z „Pokračovat"
                    během kliknutí stal submit a rezervace by se odeslala bez kroku Potvrzení. */}
                {step < 4 ? (
                  <button
                    key="next"
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={!canProceed(step)}
                    className={`btn-tech-primary flex-1 ${!canProceed(step) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    Pokračovat
                  </button>
                ) : (
                  <button
                    key="submit"
                    type="submit"
                    disabled={submitting}
                    className={`btn-tech-primary flex-1 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {submitting ? 'Odesílám...' : 'Potvrdit rezervaci'}
                  </button>
                )}
              </div>
            </form>
          </div>
          )}

          {/* Phone fallback */}
          <div className="mt-10 text-center">
            <p className="text-theme-muted mb-4 text-sm">Preferujete telefonickou rezervaci?</p>
            <a href={`tel:${CONTACT_INFO.phone.raw}`} className="btn-tech-secondary">
              <IconPhone />
              {CONTACT_INFO.phone.display}
            </a>
          </div>
        </div>
      </div>
    </TechBackground>
    <MascotCTA
      tag="Potřebujete poradit?"
      title="Máte otázku? Zavolejte nám"
      subtitle="Rádi vám poradíme s výběrem termínu nebo odpovíme na jakýkoli dotaz."
      actions={[
        { label: 'Zavolat nyní', href: '', isPhone: true, variant: 'primary' },
        { label: 'Naše služby', href: '/sluzby', variant: 'secondary' },
      ]}
    />
    </>
  );
}
