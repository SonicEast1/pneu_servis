/** Online rezervace (false = jen telefon a e-mail, odkazy vedou na Kontakty). */
export const RESERVATIONS_ENABLED = true;

export const RESERVATION_CONTACT_PATH = '/kontakty';

export function bookingHref(): string {
  return RESERVATIONS_ENABLED ? '/rezervace' : RESERVATION_CONTACT_PATH;
}

export const BOOKING_CTA_LABEL = RESERVATIONS_ENABLED ? 'Rezervovat termín' : 'Kontaktujte nás';
export const BOOKING_CTA_LABEL_ONLINE = RESERVATIONS_ENABLED ? 'Rezervovat online' : 'Kontaktujte nás';
