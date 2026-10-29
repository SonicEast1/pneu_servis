export interface Service {
  id: string;
  nazev: string;
  popis: string;
  ikona: string;
  cenaOsobni: string;
  cenaSUV: string;
  features: string[];
  kategorie: string;
  /** Zobrazit na webu */
  aktivni: boolean;
  /** Zobrazit ztmavené s štítkem „Momentálně nedostupné" */
  nedostupna: boolean;
  poradi: number;
}

/** Výchozí služby — použijí se jen při prvním spuštění bez starých dat. */
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'SRV-1',
    nazev: 'Výměna pneumatik',
    popis: 'Rychlá a profesionální výměna pneumatik. Osobní auta, SUV a dodávky, motocykly. Kontrola tlaku.',
    ikona: '🔧',
    cenaOsobni: '400 Kč',
    cenaSUV: '600 Kč',
    features: ['Osobní auta', 'SUV a dodávky', 'Motocykly', 'Kontrola tlaku'],
    kategorie: 'Základní služby',
    aktivni: true,
    nedostupna: false,
    poradi: 1,
  },
  {
    id: 'SRV-2',
    nazev: 'Vyvážení kol',
    popis: 'Precizní vyvážení na moderním zařízení pro klidnou jízdu bez vibrací.',
    ikona: '⚖️',
    cenaOsobni: '150 Kč',
    cenaSUV: '200 Kč',
    features: ['Dynamické vyvážení', 'Statické vyvážení', 'Kontrola geometrie', 'Diagnostika vibrací'],
    kategorie: 'Základní služby',
    aktivni: true,
    nedostupna: false,
    poradi: 2,
  },
  {
    id: 'SRV-3',
    nazev: 'Uskladnění pneu',
    popis: 'Skladujeme vaše pneumatiky v optimálních podmínkách. Suché prostory, označení a evidence.',
    ikona: '📦',
    cenaOsobni: '600 Kč/sezóna',
    cenaSUV: '800 Kč/sezóna',
    features: ['Suché prostory', 'Označení a evidence', 'Pojištění', 'Mytí před uskladněním'],
    kategorie: 'Uskladnění',
    aktivni: true,
    nedostupna: false,
    poradi: 3,
  },
  {
    id: 'SRV-4',
    nazev: 'Oprava pneumatik',
    popis: 'Odborná oprava defektů a poškozených pneumatik. Oprava propíchnutí, těsnění ventilků.',
    ikona: '🔨',
    cenaOsobni: '200 Kč',
    cenaSUV: '250 Kč',
    features: ['Oprava propíchnutí', 'Těsnění ventilků', 'Kontrola tlaku', 'Záplaty zevnitř'],
    kategorie: 'Opravy',
    aktivni: true,
    nedostupna: false,
    poradi: 4,
  },
  {
    id: 'SRV-5',
    nazev: 'Prodej pneumatik',
    popis: 'Široký sortiment pneumatik všech značek a rozměrů. Letní, zimní a celoroční pneumatiky.',
    ikona: '🛒',
    cenaOsobni: 'Od 1500 Kč',
    cenaSUV: 'Od 2000 Kč',
    features: ['Letní pneumatiky', 'Zimní pneumatiky', 'Celoroční pneumatiky', 'Prémiové značky'],
    kategorie: 'Prodej',
    aktivni: true,
    nedostupna: true,
    poradi: 5,
  },
  {
    id: 'SRV-6',
    nazev: 'Kompletní servis',
    popis: 'Kompletní péče o vaše kola a pneumatiky. Kontrola opotřebení, dohuštění, poradenství.',
    ikona: '🚗',
    cenaOsobni: '500 Kč',
    cenaSUV: '700 Kč',
    features: ['Kontrola opotřebení', 'Dohuštění', 'Poradenství', 'Sezonní prohlídka'],
    kategorie: 'Kompletní servis',
    aktivni: true,
    nedostupna: true,
    poradi: 6,
  },
];

/** Služby, které byly v kódu natvrdo vedené jako nedostupné — převezmou se při importu. */
export const LEGACY_UNAVAILABLE = ['Kompletní servis', 'Prodej pneumatik'];
