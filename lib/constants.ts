export const STORE_NAME = "Modas Vanina";

// Placeholder until the site has a real domain — override with
// NEXT_PUBLIC_SITE_URL once deployed (e.g. on Vercel) so metadata/sitemap
// URLs, the OG image, and canonical links resolve correctly.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/$/,
  "",
);

export const WHATSAPP_NUMBER = "542604538412";
export const WHATSAPP_DISPLAY = "+54 2604 53-8412";

export const ADDRESS = "Pedro Vargas 1673, San Rafael, Mendoza";
export const MAPS_EMBED_URL =
  "https://www.google.com/maps?q=" +
  encodeURIComponent(ADDRESS) +
  "&output=embed";
export const MAPS_LINK_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);

export const INSTAGRAM_HANDLE = "modas.vanina";
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_HANDLE}`;

export const STORE_HOURS = [
  { day: "Lunes a viernes", hours: "9:15 - 13:30 y 17:00 - 21:00" },
  { day: "Sábados", hours: "9:15 - 13:15" },
  { day: "Domingos", hours: "9:30 - 13:15" },
];

export const STORE_STORY =
  "Modas Vanina es un espacio en San Rafael donde encontrás indumentaria, perfumería, cremas, tuppers y variedades, elegidos de a poco y con cariño.";
