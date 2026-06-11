import { SITE_CONFIG } from '@/constants/metadata';
import { CONTACT_INFO } from '@/constants/contact';

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: CONTACT_INFO.phone.raw,
    email: CONTACT_INFO.email.raw,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      postalCode: CONTACT_INFO.address.zip,
      addressCountry: 'CZ',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 50.3609056,
      longitude: 15.9306848,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '150',
    },
    sameAs: [
      CONTACT_INFO.socials.facebook,
      CONTACT_INFO.socials.instagram,
      CONTACT_INFO.socials.tiktok,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
