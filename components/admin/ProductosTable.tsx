"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ShareInstagramButton } from "@/components/admin/ShareInstagramButton";
import { PublishToSocialButton } from "@/components/admin/PublishToSocialButton";
import { useToast } from "@/components/ui/Toast";
import { toggleProductHiddenAction, deleteProductAction } from "@/app/admin/productos/actions";
import { CATEGORY_LABELS, type Product } from "@/lib/types";

export function ProductosTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<Product | null>(null);

  function handleToggleHidden(product: Product) {
    startTransition(async () => {
      const result = await toggleProductHiddenAction(product.id, !product.hidden);
      if (!result.ok) showToast(result.error);
      else router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const product = toDelete;
    setToDelete(null);
    startTransition(async () => {
      const result = await deleteProductAction(product.id);
      if (!result.ok) showToast(result.error);
      else {
        showToast("Producto borrado");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Productos</h1>
        <Link href="/admin/productos/nuevo">
          <Button>
            <Plus className="h-4 w-4" /> Nuevo producto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-ink-soft">
          Todavía no hay productos cargados.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {products.map((product) => (
            <li key={product.id} className="flex items-center gap-4 p-4">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface-2">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  category={product.category}
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{product.name}</p>
                <p className="text-xs text-ink-soft">{CATEGORY_LABELS[product.category]}</p>
              </div>
              <AvailabilityBadge availability={product.availability} className="hidden sm:inline-flex" />
              <div className="flex items-center gap-2" title={product.hidden ? "Oculto" : "Visible"}>
                <Switch
                  checked={!product.hidden}
                  onCheckedChange={() => handleToggleHidden(product)}
                  disabled={isPending}
                  aria-label={product.hidden ? "Mostrar producto" : "Ocultar producto"}
                />
              </div>
              <ShareInstagramButton product={product} />
              <PublishToSocialButton product={product} />
              <Link
                href={`/admin/productos/${product.id}`}
                className="rounded-full p-2 text-ink-soft hover:bg-surface-2 hover:text-ink"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setToDelete(product)}
                className="rounded-full p-2 text-ink-soft hover:bg-accent/10 hover:text-accent"
                aria-label="Borrar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`¿Borrar "${toDelete?.name}"?`}
        description="Esta acción no se puede deshacer."
        confirmLabel="Borrar definitivamente"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
