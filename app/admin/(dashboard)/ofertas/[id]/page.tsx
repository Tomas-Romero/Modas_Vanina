import { notFound } from "next/navigation";
import { EditOfferForm } from "@/components/admin/EditOfferForm";
import { getOfferById } from "@/lib/data/offers";
import { getAllProductsForAdmin } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function EditarOfertaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [offer, products] = await Promise.all([getOfferById(id), getAllProductsForAdmin()]);
  if (!offer) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Editar oferta</h1>
      <EditOfferForm offer={offer} products={products} />
    </div>
  );
}
