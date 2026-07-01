/** Dočasně vypnuto — nastavte na true pro obnovení online rezervací. */
export const RESERVATIONS_ENABLED = false;

export const RESERVATION_CONTACT_PATH = '/kontakty';

export function bookingHref(): string {
  return RESERVATIONS_ENABLED ? '/rezervace' : RESERVATION_CONTACT_PATH;
}

export const BOOKING_CTA_LABEL = RESERVATIONS_ENABLED ? 'Rezervovat termín' : 'Kontaktujte nás';
export const BOOKING_CTA_LABEL_ONLINE = RESERVATIONS_ENABLED ? 'Rezervovat online' : 'Kontaktujte nás';
