"use client";

import { OfertaForm } from "./OfertaForm";
import { updateOfferAction } from "@/app/admin/ofertas/actions";
import type { Offer, Product } from "@/lib/types";

export function EditOfferForm({ offer, products }: { offer: Offer; products: Product[] }) {
  return (
    <OfertaForm offer={offer} products={products} onSubmit={(values) => updateOfferAction(offer.id, values)} />
  );
}
