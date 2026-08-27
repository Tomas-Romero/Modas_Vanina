"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./ImageUploader";
import { useToast } from "@/components/ui/Toast";
import { productFormSchema, type ProductFormValues } from "@/lib/validation/product";
import { CATEGORIES, CATEGORY_LABELS, AVAILABILITIES, AVAILABILITY_LABELS } from "@/lib/types";
import type { Product } from "@/lib/types";

export function ProductForm({
  product,
  onSubmit,
}: {
  product?: Product;
  onSubmit: (values: ProductFormValues) => Promise<{ ok: true; id?: string } | { ok: false; error: string }>;
}) {
  const router = useRouter();
  const showToast = useToast();
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      category: product?.category ?? "indumentaria",
      subcategory: product?.subcategory ?? "",
      images: product?.images ?? [],
      description: product?.description ?? "",
      availability: product?.availability ?? "en_stock",
    },
  });

  const images = watch("images");
  const name = watch("name");
  const category = watch("category");

  async function handleGenerateDescription() {
    if (images.length === 0) {
      showToast("Subí al menos una foto primero.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrls: images.slice(0, 3),
          productName: name,
          category: CATEGORY_LABELS[category],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setValue("description", data.description, { shouldDirty: true });
    } catch {
      showToast("No se pudo generar la descripción.");
    } finally {
      setGenerating(false);
    }
  }

  async function onValid(values: ProductFormValues) {
    setSubmitting(true);
    const result = await onSubmit(values);
    setSubmitting(false);
    if (result.ok) {
      showToast(product ? "Producto actualizado" : "Producto creado");
      router.push("/admin/productos");
      router.refresh();
    } else {
      showToast(result.error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid)} className="max-w-2xl space-y-6">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Fotos</label>
        <Controller
          control={control}
          name="images"
          render={({ field }) => <ImageUploader images={field.value} onChange={field.onChange} />}
        />
        {errors.images && <p className="mt-1.5 text-sm text-accent">{errors.images.message}</p>}
      </div>

      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
          Nombre
        </label>
        <Input id="name" {...register("name")} placeholder="Ej: Vestido Florencia" />
        {errors.name && <p className="mt-1.5 text-sm text-accent">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">
            Categoría
          </label>
          <Select id="category" {...register("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="subcategory" className="mb-1.5 block text-sm font-medium text-ink">
            Subcategoría (opcional)
          </label>
          <Input id="subcategory" {...register("subcategory")} placeholder="Ej: Vestidos" />
        </div>
      </div>

      <div>
        <label htmlFor="availability" className="mb-1.5 block text-sm font-medium text-ink">
          Disponibilidad
        </label>
        <Select id="availability" {...register("availability")}>
          {AVAILABILITIES.map((a) => (
            <option key={a} value={a}>
              {AVAILABILITY_LABELS[a]}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="description" className="block text-sm font-medium text-ink">
            Descripción
          </label>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={generating}
          >
            {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
            Generar con IA
          </Button>
        </div>
        <Textarea id="description" {...register("description")} rows={4} />
      </div>

      <div className="flex justify-end gap-3 border-t border-line pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/productos")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {product ? "Guardar cambios" : "Crear producto"}
        </Button>
      </div>
    </form>
  );
}
