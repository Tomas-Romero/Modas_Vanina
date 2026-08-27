"use client";

import { useState } from "react";
import { MessageCircle, ShoppingBag, Check } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { useMiLista } from "@/lib/hooks/useMiLista";
import { useToast } from "@/components/ui/Toast";
import { buildProductWhatsAppLink } from "@/lib/whatsapp";
import { CATEGORY_LABELS, type Product } from "@/lib/types";

export function ProductSheet({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const { add, has } = useMiLista();
  const showToast = useToast();
  const [activeImage, setActiveImage] = useState(0);

  const open = Boolean(product);

  function handleAdd() {
    if (!product) return;
    add({ id: product.id, name: product.name, category: product.category });
    showToast(`${product.name} se agregó a tu lista`);
  }

  return (
    <Sheet open={open} onClose={onClose}>
      {product && (
        <div className="pb-8">
          <div className="relative aspect-square w-full bg-surface-2">
            <ProductImage
              src={product.images[activeImage] ?? product.images[0]}
              alt={product.name}
              category={product.category}
              priority
              sizes="(min-width: 768px) 32rem, 100vw"
              className="object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="no-scrollbar flex gap-2 overflow-x-auto px-5 pt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                    i === activeImage ? "ring-accent" : "ring-transparent opacity-70"
                  }`}
                >
                  <ProductImage src={img} alt="" category={product.category} sizes="56px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="px-5 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  {CATEGORY_LABELS[product.category]}
                  {product.subcategory ? ` · ${product.subcategory}` : ""}
                </p>
                <h2 className="mt-1 font-display text-2xl text-ink">{product.name}</h2>
              </div>
              <AvailabilityBadge availability={product.availability} className="mt-1 shrink-0" />
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              {product.description || "Consultanos por más detalles de este producto."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                size="lg"
                className="flex-1"
                onClick={handleAdd}
                disabled={has(product.id)}
              >
                {has(product.id) ? (
                  <>
                    <Check className="h-4 w-4" /> En tu lista
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" /> Agregar a mi lista
                  </>
                )}
              </Button>
              <a
                href={buildProductWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="whatsapp" size="lg" className="w-full">
                  <MessageCircle className="h-4 w-4" /> Preguntar por WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}
