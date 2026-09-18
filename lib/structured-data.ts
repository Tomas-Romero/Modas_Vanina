import { ADDRESS, INSTAGRAM_URL, MAPS_LINK_URL, SITE_URL, STORE_NAME, WHATSAPP_NUMBER } from "@/lib/constants";

// Mirrors STORE_HOURS in lib/constants.ts, split into schema.org's
// machine-readable opens/closes pairs — update both if the hours change.
const OPENING_HOURS = [
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:15", closes: "13:15" },
  { dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "17:30", closes: "21:15" },
  { dayOfWeek: ["Saturday"], opens: "09:15", closes: "13:15" },
  { dayOfWeek: ["Saturday"], opens: "17:30", closes: "21:15" },
  { dayOfWeek: ["Sunday"], opens: "09:30", closes: "13:15" },
];

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: STORE_NAME,
    url: SITE_URL,
    telephone: `+${WHATSAPP_NUMBER}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Pedro Vargas 1673",
      addressLocality: "San Rafael",
      addressRegion: "Mendoza",
      addressCountry: "AR",
    },
    hasMap: MAPS_LINK_URL,
    openingHoursSpecification: OPENING_HOURS.map((h) => ({
      "@type": "OpeningHoursSpecification",
      ...h,
    })),
    sameAs: [INSTAGRAM_URL],
    description: `Indumentaria, perfumería, cremas, tuppers y variedades en ${ADDRESS}.`,
  };
}
