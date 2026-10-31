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

/** Možnosti pro „Rozměr kola" ve formuláři (stejné rozměry jako v ceníku). */
export const WHEEL_SIZE_OPTIONS: string[] = [...SIZE_COLUMNS.map((column) => column.label), 'Nevím'];
