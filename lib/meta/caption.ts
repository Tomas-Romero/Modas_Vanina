import { CATEGORY_LABELS, type Product } from "@/lib/types";
import { INSTAGRAM_HANDLE, WHATSAPP_DISPLAY } from "@/lib/constants";

function toHashtag(label: string): string {
  // Strip accents (Perfumería -> Perfumeria) without relying on a literal
  // combining-marks regex range — see CatalogClient.tsx's normalize() for
  // why that's worth avoiding.
  const stripped = label
    .normalize("NFD")
    .split("")
    .filter((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      return code < 0x0300 || code > 0x036f;
    })
    .join("");
  return stripped.replace(/\s+/g, "");
}

export function buildSocialCaption(product: Pick<Product, "name" | "category" | "description">): string {
  const lines = [
    `${product.name} ✨`,
    "",
    product.description || `Nueva pieza de ${CATEGORY_LABELS[product.category]} ya disponible.`,
    "",
    `Consultanos disponibilidad por WhatsApp ${WHATSAPP_DISPLAY} 💬`,
    `#${toHashtag(CATEGORY_LABELS[product.category])} #ModasVanina #SanRafael`,
  ];
  return lines.join("\n").trim() + `\n\n@${INSTAGRAM_HANDLE}`;
}
