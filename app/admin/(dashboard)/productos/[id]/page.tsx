import { notFound } from "next/navigation";
import { EditProductForm } from "@/components/admin/EditProductForm";
import { getProductById } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl text-ink">Editar producto</h1>
      <EditProductForm product={product} />
    </div>
  );
}
