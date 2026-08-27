import { MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import {
  ADDRESS,
  INSTAGRAM_URL,
  MAPS_EMBED_URL,
  MAPS_LINK_URL,
  STORE_HOURS,
  STORE_STORY,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

export const metadata = {
  title: "Nosotros — Modas Vanina",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="font-display text-2xl text-ink md:text-3xl">Nosotros</h1>
      <p className="mt-4 text-balance leading-relaxed text-ink-soft">{STORE_STORY}</p>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        <iframe
          title="Ubicación de Modas Vanina"
          src={MAPS_EMBED_URL}
          className="h-64 w-full grayscale-[15%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2 font-medium text-ink">
            <MapPin className="h-4 w-4 text-accent" /> Dirección
          </div>
          <a
            href={MAPS_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-ink-soft hover:text-ink"
          >
            {ADDRESS}
          </a>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5">
          <div className="flex items-center gap-2 font-medium text-ink">
            <Clock className="h-4 w-4 text-accent" /> Horarios
          </div>
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {STORE_HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="h-4 w-4" /> {WHATSAPP_DISPLAY}
          </Button>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            <InstagramIcon className="h-4 w-4" /> @modas_vanina
          </Button>
        </a>
      </div>
    </div>
  );
}
