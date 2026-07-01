export const PRICING_META = {
  vatNote: 'Ceny jsou uvedeny v Kč včetně DPH 21 %.',
  validFrom: '1. 10. 2026',
  perUnitNote: 'Cena za 1 ks v Kč včetně DPH.',
} as const;

export const SIZE_COLUMNS = [
  { key: 'r12', label: 'R12' },
  { key: 'r13', label: 'R13' },
  { key: 'r14', label: 'R14' },
  { key: 'r15', label: 'R15' },
  { key: 'r16', label: 'R16' },
  { key: 'r17', label: 'R17' },
  { key: 'r18', label: 'R18' },
  { key: 'r19', label: 'R19' },
  { key: 'r20', label: 'R20' },
  { key: 'r21', label: 'R21' },
  { key: 'r22', label: 'R22' },
  { key: 'r23', label: 'R23' },
  { key: 'r24', label: 'R24' },
  { key: 'van', label: 'VAN/SUV 15"–17"' },
  { key: 'suv', label: 'SUV/Offroad 18" a více' },
] as const;

export type SizeKey = (typeof SIZE_COLUMNS)[number]['key'];

export interface SizedPriceRow {
  name: string;
  description?: string;
  prices: Record<SizeKey, number>;
}

export interface SupplementaryPriceRow {
  name: string;
  unit: string;
  note?: string;
  price: number;
}

export const SERVICE_PACKAGES: SizedPriceRow[] = [
  {
    name: 'Set 1 – KOMPLETNÍ PŘEZUTÍ',
    description: 'výměna kola z osy na osu, výměna pneu, vyvážení, závaží, ventil',
    prices: { r12: 170, r13: 185, r14: 200, r15: 225, r16: 250, r17: 300, r18: 325, r19: 350, r20: 375, r21: 400, r22: 425, r23: 450, r24: 500, van: 375, suv: 425 },
  },
  {
    name: 'Set 2 – VÝMĚNA KOLA + VYVÁŽENÍ',
    description: 'výměna kola z osy na osu, vyvážení, závaží',
    prices: { r12: 115, r13: 125, r14: 125, r15: 150, r16: 165, r17: 205, r18: 220, r19: 235, r20: 250, r21: 265, r22: 280, r23: 295, r24: 335, van: 225, suv: 255 },
  },
  {
    name: 'Set 3 – VÝMĚNA KOLA',
    description: 'výměna kola z osy na osu, bez vyvážení',
    prices: { r12: 50, r13: 65, r14: 75, r15: 75, r16: 85, r17: 95, r18: 105, r19: 110, r20: 115, r21: 120, r22: 130, r23: 130, r24: 130, van: 115, suv: 125 },
  },
  {
    name: 'Set 4 – VÝMĚNA PNEU + VYVÁŽENÍ',
    description: 'výměna pneu, vyvážení, závaží, ventil',
    prices: { r12: 120, r13: 140, r14: 150, r15: 175, r16: 190, r17: 205, r18: 220, r19: 240, r20: 260, r21: 270, r22: 280, r23: 290, r24: 300, van: 260, suv: 300 },
  },
  {
    name: 'Set 5 – MONTÁŽ PNEU + VYVÁŽENÍ',
    description: 'montáž pneu na disk, vyvážení, ventil, závaží',
    prices: { r12: 95, r13: 100, r14: 110, r15: 125, r16: 135, r17: 145, r18: 155, r19: 165, r20: 175, r21: 185, r22: 195, r23: 205, r24: 215, van: 180, suv: 205 },
  },
];

export const ADDITIONAL_SERVICES: SizedPriceRow[] = [
  {
    name: 'Set 3 – VÝMĚNA KOLA',
    description: 'výměna kola z osy na osu, bez vyvážení',
    prices: { r12: 50, r13: 55, r14: 60, r15: 65, r16: 75, r17: 90, r18: 95, r19: 100, r20: 105, r21: 110, r22: 115, r23: 120, r24: 125, van: 105, suv: 115 },
  },
  {
    name: 'VÝMĚNA PNEU',
    description: 'výměna pneu na disku, ventil, bez vyvážení',
    prices: { r12: 55, r13: 60, r14: 65, r15: 75, r16: 80, r17: 100, r18: 110, r19: 120, r20: 130, r21: 140, r22: 150, r23: 160, r24: 190, van: 130, suv: 150 },
  },
  {
    name: 'VYVÁŽENÍ KOLA',
    description: 'včetně závaží',
    prices: { r12: 65, r13: 70, r14: 75, r15: 85, r16: 95, r17: 110, r18: 120, r19: 130, r20: 140, r21: 150, r22: 160, r23: 170, r24: 185, van: 140, suv: 160 },
  },
  {
    name: 'MONTÁŽ PNEU',
    description: 'včetně ventilku, bez vyvážení',
    prices: { r12: 30, r13: 35, r14: 35, r15: 40, r16: 45, r17: 55, r18: 60, r19: 65, r20: 70, r21: 75, r22: 80, r23: 85, r24: 100, van: 70, suv: 80 },
  },
  {
    name: 'DEMONTÁŽ PNEU',
    description: 'demontáž pneu z disku',
    prices: { r12: 25, r13: 25, r14: 30, r15: 35, r16: 35, r17: 45, r18: 50, r19: 55, r20: 60, r21: 65, r22: 70, r23: 75, r24: 90, van: 60, suv: 70 },
  },
  {
    name: 'Mytí kola',
    prices: { r12: 25, r13: 25, r14: 25, r15: 25, r16: 25, r17: 25, r18: 25, r19: 25, r20: 25, r21: 25, r22: 25, r23: 25, r24: 25, van: 25, suv: 25 },
  },
];

export const SUPPLEMENTARY_SERVICES: SupplementaryPriceRow[] = [
  { name: 'OPRAVA PNEU', unit: '1 ks', note: 'včetně materiálu i práce s pneu', price: 300 },
  { name: 'PŘÍPLATEK ZA SERVIS RUNFLAT PNEU', unit: '1 ks', price: 75 },
  { name: 'TPMS – montáž/demontáž senzoru', unit: '1 ks', price: 25 },
  { name: 'TPMS – programování/spárování senzoru', unit: '1 vozidlo', price: 250 },
  { name: 'TPMS – kontrola senzorů', unit: '1 vozidlo', price: 80 },
  { name: 'TPMS – aktivace přímého systému měření', unit: '1 vozidlo', price: 80 },
  { name: 'Odvoz pneumatiky k likvidaci', unit: '1 ks', price: 50 },
  { name: 'Ostatní mechanické práce', unit: '1 hodina', note: 'účtováno po 1/2 hodiny dle skutečného času', price: 500 },
];

export function formatPrice(amount: number): string {
  return `${amount} Kč`;
}
