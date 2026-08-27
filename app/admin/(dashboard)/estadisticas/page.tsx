import { MessageCircle } from "lucide-react";
import { getTopProductInquiries } from "@/lib/data/analytics";
import { getAllProductsForAdmin } from "@/lib/data/products";

export const dynamic = "force-dynamic";

export const metadata = { title: "Estadísticas" };

export default async function EstadisticasPage() {
  const [inquiries, products] = await Promise.all([
    getTopProductInquiries(),
    getAllProductsForAdmin(),
  ]);
  const productsById = new Map(products.map((p) => [p.id, p]));
  const maxCount = Math.max(1, ...inquiries.map((i) => i.count));

  return (
    <div>
      <h1 className="font-display text-2xl text-ink">Estadísticas</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Qué productos generan más clics en &quot;Preguntar por WhatsApp&quot;.
      </p>

      {inquiries.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-line py-16 text-center">
          <MessageCircle className="h-8 w-8 text-ink-soft" />
          <p className="mt-3 font-display text-lg text-ink">Todavía no hay consultas</p>
          <p className="mt-1 max-w-xs text-sm text-ink-soft">
            Cuando alguien toque &quot;Preguntar por WhatsApp&quot; en el catálogo, va a aparecer acá.
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-5">
          {inquiries.map(({ productId, count }) => {
            const product = productsById.get(productId);
            return (
              <li key={productId}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-ink">
                    {product?.name ?? "Producto eliminado"}
                  </span>
                  <span className="shrink-0 text-sm text-ink-soft">
                    {count} consulta{count === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
