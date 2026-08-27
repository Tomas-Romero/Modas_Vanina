"use client";

import { motion } from "framer-motion";
import { ProductImage } from "@/components/ui/ProductImage";
import { AvailabilityBadge } from "@/components/ui/Badge";
import { CATEGORY_LABELS, type Product } from "@/lib/types";

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (id: string) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(product.id)}
      whileTap={{ scale: 0.97 }}
      className="group flex w-full flex-col text-left"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-surface-2 transition-shadow duration-300 group-hover:border-accent/30 group-hover:shadow-soft">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          category={product.category}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.availability !== "en_stock" && (
          <AvailabilityBadge
            availability={product.availability}
            className="absolute left-2 top-2 bg-surface/90 backdrop-blur-sm"
          />
        )}
      </div>
      <p className="mt-2.5 line-clamp-1 text-sm font-medium text-ink">{product.name}</p>
      <p className="text-xs text-ink-soft">{CATEGORY_LABELS[product.category]}</p>
    </motion.button>
  );
}
