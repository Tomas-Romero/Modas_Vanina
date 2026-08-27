import { NewOfferForm } from "@/components/admin/NewOfferForm";
import { getAllProductsForAdmin } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function NuevaOfertaPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Nueva oferta</h1>
      <NewOfferForm products={products} />
    </div>
  );
}
