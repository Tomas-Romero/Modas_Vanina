import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Offer, Product } from "@/lib/types";

export function OffersCarousel({
  offers,
  productsById,
}: {
  offers: Offer[];
  productsById: Map<string, Product>;
}) {
  if (offers.length === 0) return null;

  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {offers.map((offer) => {
        const products = offer.product_ids
          .map((id) => productsById.get(id))
          .filter((p): p is Product => Boolean(p));
        const cover = products[0];

        return (
          <Link
            key={offer.id}
            href={cover ? `/catalogo?producto=${cover.id}` : "/catalogo"}
            className="group relative h-44 w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-surface-2 shadow-soft"
          >
            {cover && (
              <ProductImage
                src={cover.images[0]}
                alt={cover.name}
                category={cover.category}
                sizes="288px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <p className="font-display text-lg text-white">{offer.title}</p>
              <p className="text-xs text-white/80">
                {products.length} producto{products.length === 1 ? "" : "s"}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
