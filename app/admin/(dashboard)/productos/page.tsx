import { ProductosTable } from "@/components/admin/ProductosTable";
import { getAllProductsForAdmin } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const products = await getAllProductsForAdmin();
  return <ProductosTable products={products} />;
}
