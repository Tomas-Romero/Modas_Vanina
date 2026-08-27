import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CategoryShortcuts } from "@/components/home/CategoryShortcuts";
import { OffersCarousel } from "@/components/home/OffersCarousel";
import { getAllOffers } from "@/lib/data/offers";
import { getProductsByIds } from "@/lib/data/products";
import { isOfferActive } from "@/lib/types";
import { STORE_STORY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const offers = await getAllOffers();
  const activeOffers = offers.filter((o) => isOfferActive(o));
  const allProductIds = [...new Set(activeOffers.flatMap((o) => o.product_ids))];
  const products = await getProductsByIds(allProductIds);
  const productsById = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <section className="animate-fade-in overflow-hidden rounded-3xl bg-surface-2 px-6 py-12 text-center md:px-16 md:py-20">
        <h1 className="mx-auto max-w-xl text-balance font-display text-3xl leading-tight text-ink md:text-5xl">
          Un rincón de estilo en San Rafael
        </h1>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm text-ink-soft md:text-base">
          {STORE_STORY}
        </p>
        <div className="mt-7 flex justify-center">
          <Link href="/catalogo">
            <Button size="lg">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-10 md:mt-14">
        <h2 className="mb-4 font-display text-xl text-ink md:text-2xl">Categorías</h2>
        <CategoryShortcuts />
      </section>

      {activeOffers.length > 0 && (
        <section className="mt-10 md:mt-14">
          <h2 className="mb-4 font-display text-xl text-ink md:text-2xl">Ofertas y novedades</h2>
          <OffersCarousel offers={activeOffers} productsById={productsById} />
        </section>
      )}
    </div>
  );
}
