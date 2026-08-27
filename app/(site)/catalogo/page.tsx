import type { Metadata } from "next";
import { CatalogClient } from "./CatalogClient";
import { getVisibleProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Indumentaria, perfumería, cremas, tuppers y variedades de Modas Vanina. Elegí y consultá disponibilidad por WhatsApp.",
};

export default async function CatalogoPage() {
  const products = await getVisibleProducts();

  return <CatalogClient products={products} />;
}
