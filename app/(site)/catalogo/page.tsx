import { CatalogClient } from "./CatalogClient";
import { getVisibleProducts } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const products = await getVisibleProducts();

  return <CatalogClient products={products} />;
}
