"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { createProductAction } from "@/app/admin/productos/actions";

export default function NuevoProductoPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Nuevo producto</h1>
      <ProductForm onSubmit={(values) => createProductAction(values)} />
    </div>
  );
}
