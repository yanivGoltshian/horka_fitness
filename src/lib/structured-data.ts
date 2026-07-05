import { site } from "@/lib/data";

export const SITE_URL =
  (process.env.NEXT_PUBLIC_SITE_URL || "https://horka-fitness.vercel.app") +
  (process.env.NEXT_PUBLIC_BASE_PATH || "");

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["HealthClub", "SportsActivityLocation", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    legalName: site.legalName,
    description: site.description,
    url: SITE_URL,
    logo: `${SITE_URL}/images/brand/logo.jpg`,
    image: `${SITE_URL}/images/gallery/gallery-08.jpg`,
    telephone: site.phone,
    ...(site.email ? { email: site.email } : {}),
    priceRange: "₪₪",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: "IL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.0157,
      longitude: 34.7793,
    },
    hasMap: `https://maps.google.com/maps?q=${encodeURIComponent(`${site.address} ${site.city}`)}`,
    areaServed: [
      { "@type": "City", name: "חולון" },
      { "@type": "AdministrativeArea", name: "מחוז תל אביב" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        opens: "07:00",
        closes: "21:00",
      },
    ],
    sameAs: [site.instagram].filter(Boolean),
  };
}

export function faqPageLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: site.name,
    url: SITE_URL,
    inLanguage: "he-IL",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
