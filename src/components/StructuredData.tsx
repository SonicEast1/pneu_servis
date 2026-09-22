import { SITE_CONFIG } from '@/constants/metadata';
import { CONTACT_INFO } from '@/constants/contact';

export default function StructuredData() {
  const businessId = `${SITE_CONFIG.url}/#pneuservis`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_CONFIG.url}/#website`,
        url: SITE_CONFIG.url,
        name: 'PneuservisVMK',
        alternateName: ['Pneuservis VMK', 'PneuservisVMK Jaroměř', 'pneuservisvmk'],
        description: SITE_CONFIG.description,
        inLanguage: 'cs-CZ',
        publisher: { '@id': businessId },
      },
      {
        '@type': ['TireShop', 'AutoRepair'],
        '@id': businessId,
        name: 'PneuservisVMK',
        alternateName: ['Pneuservis VMK', 'PneuservisVMK Jaroměř', 'VMK Pneuservis'],
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        image: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
        },
        telephone: CONTACT_INFO.phone.raw,
        email: CONTACT_INFO.email.raw,
        priceRange: '$$',
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
        hasMap: 'https://www.google.com/maps/search/?api=1&query=Nachodska+118+Jaromer',
        areaServed: {
          '@type': 'City',
          name: 'Jaroměř',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '16:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '14:00',
          },
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Služby pneuservisu',
          itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Přezutí a výměna pneumatik' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Vyvážení kol' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Uskladnění pneumatik' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Oprava defektů' } },
          ],
        },
        sameAs: [
          CONTACT_INFO.socials.facebook,
          CONTACT_INFO.socials.instagram,
          CONTACT_INFO.socials.tiktok,
          CONTACT_INFO.seznam.pageUrl,
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
