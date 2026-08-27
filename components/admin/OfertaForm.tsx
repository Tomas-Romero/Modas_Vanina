"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { offerFormSchema, type OfferFormValues } from "@/lib/validation/offer";
import { CATEGORY_LABELS, type Offer, type Product } from "@/lib/types";

export function OfertaForm({
  offer,
  products,
  onSubmit,
}: {
  offer?: Offer;
  products: Product[];
  onSubmit: (values: OfferFormValues) => Promise<{ ok: true; id?: string } | { ok: false; error: string }>;
}) {
  const router = useRouter();
  const showToast = useToast();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: offer?.title ?? "",
      product_ids: offer?.product_ids ?? [],
      ends_at: offer?.ends_at ? offer.ends_at.slice(0, 10) : "",
    },
  });

  async function onValid(values: OfferFormValues) {
    setSubmitting(true);
    const result = await onSubmit(values);
    setSubmitting(false);
    if (result.ok) {
      showToast(offer ? "Oferta actualizada" : "Oferta creada");
      router.push("/admin/ofertas");
      router.refresh();
    } else {
      showToast(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="max-w-2xl space-y-6">
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">
          Título
        </label>
        <Input id="title" {...register("title")} placeholder="Ej: Novedades de la semana" />
        {errors.title && <p className="mt-1.5 text-sm text-accent">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="ends_at" className="mb-1.5 block text-sm font-medium text-ink">
          Fecha de fin (opcional)
        </label>
        <Input id="ends_at" type="date" {...register("ends_at")} className="max-w-xs" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">Productos incluidos</label>
        <Controller
          control={control}
          name="product_ids"
          render={({ field }) => (
            <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-line p-2">
              {products.map((p) => {
                const checked = field.value.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-surface-2"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        field.onChange(
                          e.target.checked
                            ? [...field.value, p.id]
                            : field.value.filter((id) => id !== p.id),
                        );
                      }}
                      className="h-4 w-4 rounded accent-[var(--accent)]"
                    />
                    <span className="text-sm text-ink">{p.name}</span>
                    <span className="text-xs text-ink-soft">{CATEGORY_LABELS[p.category]}</span>
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.product_ids && <p className="mt-1.5 text-sm text-accent">{errors.product_ids.message}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-line pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/ofertas")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {offer ? "Guardar cambios" : "Crear oferta"}
        </Button>
      </div>
    </form>
  );
}
