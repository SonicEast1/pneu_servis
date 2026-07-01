import { redirect } from 'next/navigation';
import { RESERVATIONS_ENABLED, RESERVATION_CONTACT_PATH } from '@/constants/reservation';
import BookingPageContent from './BookingPageContent';

export default function RezervacePage() {
  if (!RESERVATIONS_ENABLED) {
    redirect(RESERVATION_CONTACT_PATH);
  }

  return <BookingPageContent />;
}
