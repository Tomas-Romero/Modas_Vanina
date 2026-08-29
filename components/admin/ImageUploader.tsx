"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useToast } from "@/components/ui/Toast";

const DEMO_MODE = !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

async function uploadToCloudinary(file: File): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", { method: "POST" });
  if (!signRes.ok) throw new Error("No se pudo firmar la subida.");
  const { signature, timestamp, apiKey, cloudName, folder } = await signRes.json();

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("signature", signature);
  form.append("folder", folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  if (!uploadRes.ok) throw new Error("Cloudinary rechazó la imagen.");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const showToast = useToast();

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (DEMO_MODE) {
          uploaded.push(URL.createObjectURL(file));
        } else {
          uploaded.push(await uploadToCloudinary(file));
        }
      }
      onChange([...images, ...uploaded]);
      if (DEMO_MODE) {
        showToast("Cloudinary no está configurado — usando preview local (demo)");
      }
    } catch (err) {
      console.error(err);
      showToast("No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function makeCover(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      {DEMO_MODE && (
        <p className="mb-2 text-xs text-gold">
          Modo demo: las fotos se previsualizan localmente, no se suben de verdad hasta configurar Cloudinary.
        </p>
      )}
      <p className="mb-2 text-xs text-ink-soft">
        Mejor resultado: foto vertical (relación 4:5, ej. 1200×1500px), producto centrado y con margen alrededor.
      </p>
      <div className="flex flex-wrap gap-3">
        {images.map((src, index) => (
          <div key={src + index} className="group relative h-24 w-24 overflow-hidden rounded-xl bg-surface-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute left-1 top-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent-ink)]">
                Portada
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/50 opacity-0 transition-opacity group-hover:opacity-100">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => makeCover(index)}
                  aria-label="Hacer portada"
                  className="rounded-full bg-white/90 p-1.5 text-ink hover:bg-white"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Quitar foto"
                className="rounded-full bg-white/90 p-1.5 text-ink hover:bg-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            "flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-ink-soft transition-colors hover:border-accent/40 hover:text-accent",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
          <span className="text-[11px]">{uploading ? "Subiendo..." : "Agregar"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
