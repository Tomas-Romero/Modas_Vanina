"use client";

import { OfertaForm } from "./OfertaForm";
import { createOfferAction } from "@/app/admin/ofertas/actions";
import type { Product } from "@/lib/types";

export function NewOfferForm({ products }: { products: Product[] }) {
  return <OfertaForm products={products} onSubmit={(values) => createOfferAction(values)} />;
}
