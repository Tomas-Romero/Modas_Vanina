export const CATEGORIES = [
  "indumentaria",
  "perfumeria",
  "cremas",
  "tuppers",
  "varios",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, string> = {
  indumentaria: "Indumentaria",
  perfumeria: "Perfumería",
  cremas: "Cremas",
  tuppers: "Tuppers",
  varios: "Varios",
};

export const AVAILABILITIES = [
  "en_stock",
  "ultimas_unidades",
  "agotado",
] as const;

export type Availability = (typeof AVAILABILITIES)[number];

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  en_stock: "En stock",
  ultimas_unidades: "Últimas unidades",
  agotado: "Agotado",
};

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: string | null;
  images: string[];
  description: string;
  availability: Availability;
  hidden: boolean;
  created_at: string;
}

export interface Offer {
  id: string;
  title: string;
  product_ids: string[];
  starts_at: string;
  ends_at: string | null;
  position: number;
}

export function isOfferActive(offer: Offer, now: Date = new Date()): boolean {
  const starts = new Date(offer.starts_at);
  const ends = offer.ends_at ? new Date(offer.ends_at) : null;
  return starts <= now && (!ends || ends >= now);
}
