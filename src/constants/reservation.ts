import { SIZE_COLUMNS } from '@/constants/pricing';

/** Online rezervace (false = jen telefon a e-mail, odkazy vedou na Kontakty). */
export const RESERVATIONS_ENABLED = true;

export const RESERVATION_CONTACT_PATH = '/kontakty';

export function bookingHref(): string {
  return RESERVATIONS_ENABLED ? '/rezervace' : RESERVATION_CONTACT_PATH;
}

export const BOOKING_CTA_LABEL = RESERVATIONS_ENABLED ? 'Rezervovat termín' : 'Kontaktujte nás';
export const BOOKING_CTA_LABEL_ONLINE = RESERVATIONS_ENABLED ? 'Rezervovat online' : 'Kontaktujte nás';

/** Délka jednoho termínu v minutách — rezervace se nabízí po celých hodinách. */
export const BOOKING_SLOT_MINUTES = 60;

/** Nejdřívější čas rezervace (i když se otevírá dřív) — HH:MM. */
export const BOOKING_EARLIEST = '09:00';

/** Možnosti pro „Rozměr kola" ve formuláři (stejné rozměry jako v ceníku). */
/** Kolik kol se bude měnit: 1–4 přímo, větší počet přes „5+“. */
export const WHEEL_COUNT_BASIC: string[] = ['1', '2', '3', '4'];
export const WHEEL_COUNT_MORE: string[] = ['5', '6', '7', '8', '9', '10'];
export const WHEEL_COUNT_OPTIONS: string[] = [...WHEEL_COUNT_BASIC, ...WHEEL_COUNT_MORE];

/** „1 kolo“, „3 kola“, „6 kol“ */
export function wheelCountLabel(count: string): string {
  const n = Number(count);
  if (n === 1) return '1 kolo';
  if (n >= 2 && n <= 4) return `${n} kola`;
  return `${count} kol`;
}

export const WHEEL_SIZE_OPTIONS: string[] = [...SIZE_COLUMNS.map((column) => column.label), 'Nevím'];
