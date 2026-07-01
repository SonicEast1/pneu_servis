/** Služby dočasně nedostupné — zobrazí se ztmavené na stránce Služby. */
export const TEMPORARILY_UNAVAILABLE_SERVICES = [
  'Uskladnění pneu',
  'Kompletní servis',
  'Prodej pneumatik',
] as const;

export function isServiceTemporarilyUnavailable(nazev: string): boolean {
  return TEMPORARILY_UNAVAILABLE_SERVICES.includes(
    nazev as (typeof TEMPORARILY_UNAVAILABLE_SERVICES)[number]
  );
}
