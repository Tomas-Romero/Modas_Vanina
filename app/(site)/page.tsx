import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/layout/Logo";
import { CategoryShortcuts } from "@/components/home/CategoryShortcuts";
import { OffersCarousel } from "@/components/home/OffersCarousel";
import { RevealSection } from "@/components/home/RevealSection";
import { getAllOffers } from "@/lib/data/offers";
import { getProductsByIds } from "@/lib/data/products";
import { isOfferActive } from "@/lib/types";
import { STORE_SLOGAN, STORE_STORY } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const offers = await getAllOffers();
  const activeOffers = offers.filter((o) => isOfferActive(o));
  const allProductIds = [...new Set(activeOffers.flatMap((o) => o.product_ids))];
  const products = await getProductsByIds(allProductIds);
  const productsById = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <section className="relative animate-fade-in overflow-hidden rounded-3xl border border-line bg-surface-2 px-6 py-12 text-center md:px-16 md:py-20">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />
        <h1 className="relative mx-auto flex flex-col items-center text-ink">
          <span className="font-display text-xs font-medium uppercase tracking-[0.5em] text-ink-soft md:text-sm">
            Modas
          </span>
          <span className="font-display text-4xl font-semibold uppercase leading-none tracking-wide md:text-6xl">
            Vanina
          </span>
        </h1>
        <span className="relative mx-auto mt-3 block h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent md:w-28" />
        <p className="relative mx-auto mt-4 max-w-md text-balance text-sm font-medium text-accent md:text-base">
          {STORE_SLOGAN}
        </p>
        <p className="relative mx-auto mt-3 max-w-md text-balance text-sm text-ink-soft md:text-base">
          {STORE_STORY}
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/catalogo">
            <Button size="lg">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          {activeOffers.length > 0 && (
            <a href="#ofertas">
              <Button size="lg" variant="secondary">
                <Sparkles className="h-4 w-4" /> Ver ofertas
              </Button>
            </a>
          )}
        </div>
      </section>

      <RevealSection className="mt-10 md:mt-14">
        <h2 className="mb-4 font-display text-xl text-ink md:text-2xl">Categorías</h2>
        <CategoryShortcuts />
      </RevealSection>

      {activeOffers.length > 0 && (
        <RevealSection id="ofertas" className="mt-12 scroll-mt-24 md:mt-16">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">Recién llegado</p>
              <h2 className="font-display text-xl text-ink md:text-2xl">Ofertas y novedades</h2>
            </div>
            <Link
              href="/catalogo"
              className="shrink-0 text-sm font-medium text-accent hover:underline underline-offset-4"
            >
              Ver catálogo completo
            </Link>
          </div>
          <OffersCarousel offers={activeOffers} productsById={productsById} />
        </RevealSection>
      )}

      <div className="mt-14 flex justify-center opacity-60 md:mt-20">
        <LogoMark size="sm" />
      </div>
    </div>
  );
}
