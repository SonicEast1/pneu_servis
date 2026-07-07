/** Služby, které teprve chystáme — zobrazí se normálně s odznakem „Připravujeme". */
export const COMING_SOON_SERVICES = [
  'Uskladnění pneu',
  'Kompletní servis',
  'Prodej pneumatik',
] as const;

export function isServiceComingSoon(nazev: string): boolean {
  return COMING_SOON_SERVICES.includes(
    nazev as (typeof COMING_SOON_SERVICES)[number]
  );
}
