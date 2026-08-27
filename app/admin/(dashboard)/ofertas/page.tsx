import { OfertasTable } from "@/components/admin/OfertasTable";
import { getAllOffers } from "@/lib/data/offers";

export const dynamic = "force-dynamic";

export default async function AdminOfertasPage() {
  const offers = await getAllOffers();
  return <OfertasTable offers={offers} />;
}
