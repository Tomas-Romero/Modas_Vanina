"use client";

import { ProductForm } from "./ProductForm";
import { updateProductAction } from "@/app/admin/productos/actions";
import type { Product } from "@/lib/types";

export function EditProductForm({ product }: { product: Product }) {
  return <ProductForm product={product} onSubmit={(values) => updateProductAction(product.id, values)} />;
}
