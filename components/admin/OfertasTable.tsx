"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { deleteOfferAction, moveOfferPositionAction } from "@/app/admin/ofertas/actions";
import { isOfferActive, type Offer } from "@/lib/types";

export function OfertasTable({ offers }: { offers: Offer[] }) {
  const router = useRouter();
  const showToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [toDelete, setToDelete] = useState<Offer | null>(null);

  function move(id: string, direction: "up" | "down") {
    startTransition(async () => {
      const result = await moveOfferPositionAction(id, direction);
      if (!result.ok) showToast(result.error);
      else router.refresh();
    });
  }

  function confirmDelete() {
    if (!toDelete) return;
    const offer = toDelete;
    setToDelete(null);
    startTransition(async () => {
      const result = await deleteOfferAction(offer.id);
      if (!result.ok) showToast(result.error);
      else {
        showToast("Oferta borrada");
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Ofertas</h1>
        <Link href="/admin/ofertas/nuevo">
          <Button>
            <Plus className="h-4 w-4" /> Nueva oferta
          </Button>
        </Link>
      </div>

      {offers.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-ink-soft">
          Todavía no hay ofertas cargadas.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
          {offers.map((offer, index) => (
            <li key={offer.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => move(offer.id, "up")}
                  disabled={isPending || index === 0}
                  className="rounded p-0.5 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label="Subir"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(offer.id, "down")}
                  disabled={isPending || index === offers.length - 1}
                  className="rounded p-0.5 text-ink-soft hover:text-ink disabled:opacity-30"
                  aria-label="Bajar"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{offer.title}</p>
                <p className="text-xs text-ink-soft">
                  {offer.product_ids.length} producto{offer.product_ids.length === 1 ? "" : "s"}
                  {offer.ends_at ? ` · hasta ${new Date(offer.ends_at).toLocaleDateString("es-AR")}` : ""}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isOfferActive(offer) ? "bg-good/15 text-good" : "bg-ink-soft/15 text-ink-soft"
                }`}
              >
                {isOfferActive(offer) ? "Activa" : "Inactiva"}
              </span>
              <Link
                href={`/admin/ofertas/${offer.id}`}
                className="rounded-full p-2 text-ink-soft hover:bg-surface-2 hover:text-ink"
                aria-label="Editar"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setToDelete(offer)}
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
        title={`¿Borrar "${toDelete?.title}"?`}
        description="Esta acción no se puede deshacer."
        confirmLabel="Borrar definitivamente"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
