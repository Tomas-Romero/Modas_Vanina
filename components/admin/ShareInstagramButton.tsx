"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { useToast } from "@/components/ui/Toast";
import { generateInstagramCard } from "@/lib/canvas/instagramCard";
import type { Product } from "@/lib/types";

export function ShareInstagramButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  async function handleClick() {
    setLoading(true);
    try {
      const blob = await generateInstagramCard(product);
      const file = new File([blob], `modas-vanina-${product.id}.jpg`, { type: "image/jpeg" });
      const shareData = {
        files: [file],
        title: product.name,
        text: `Mirá "${product.name}" en Modas Vanina`,
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `modas-vanina-${product.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast("Imagen descargada — subila desde la app de Instagram");
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        showToast("No se pudo generar la imagen para compartir.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label="Compartir tarjeta para Instagram"
      title="Compartir tarjeta para Instagram"
      className="rounded-full p-2 text-ink-soft hover:bg-surface-2 hover:text-accent disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <InstagramIcon className="h-4 w-4" />}
    </button>
  );
}
