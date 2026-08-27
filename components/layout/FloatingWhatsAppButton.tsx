import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function FloatingWhatsAppButton() {
  const text = encodeURIComponent(
    "Hola! Quería consultar sobre los productos de Modas Vanina.",
  );

  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed right-4 bottom-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-good text-white shadow-soft transition-transform hover:scale-105 active:scale-95 motion-safe:animate-[pulse-ring_2.6s_ease-out_infinite] md:bottom-8"
    >
      <MessageCircle className="h-6 w-6" fill="white" />
    </a>
  );
}
