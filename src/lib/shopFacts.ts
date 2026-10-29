import { DEFAULT_OPENING_HOURS, type OpeningHour, type SpecialDay } from '@/lib/openingHours';
import { DEFAULT_PRICING, type Pricing } from '@/constants/pricing';
import { DEFAULT_SERVICES } from '@/constants/services';

/** Aktuální údaje o dílně, ze kterých odpovídá maskot v chatu. */
export interface ShopFacts {
  hours: OpeningHour[];
  specials: SpecialDay[];
  pricing: Pricing;
  /** Názvy služeb, které teď neděláme */
  unavailable: string[];
}

/** Záloha, když se data z databáze nepodaří načíst. */
export const DEFAULT_FACTS: ShopFacts = {
  hours: DEFAULT_OPENING_HOURS,
  specials: [],
  pricing: DEFAULT_PRICING,
  unavailable: DEFAULT_SERVICES.filter((service) => service.nedostupna).map((service) => service.nazev),
};
