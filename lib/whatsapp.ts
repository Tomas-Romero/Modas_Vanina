import { WHATSAPP_NUMBER } from "./constants";
import { CATEGORY_LABELS, type Product } from "./types";

function buildLink(text: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function buildProductWhatsAppLink(product: Pick<Product, "name" | "category">): string {
  const text = `Hola! Vi este producto en la web y quería consultar: ${product.name} (${CATEGORY_LABELS[product.category]}). ¿Me contás disponibilidad y precio?`;
  return buildLink(text);
}

export function buildListWhatsAppLink(items: Pick<Product, "name" | "category">[]): string {
  const lines = items
    .map((p) => `• ${p.name} (${CATEGORY_LABELS[p.category]})`)
    .join("\n");
  const text = `Hola! Vi estos productos en la web y quería consultar:\n\n${lines}\n\n¿Me contás disponibilidad y precio? Gracias!`;
  return buildLink(text);
}
