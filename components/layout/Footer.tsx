import { MapPin, MessageCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Logo } from "./Logo";
import {
  ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MAPS_LINK_URL,
  STORE_HOURS,
  STORE_SLOGAN,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line/70 bg-surface">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3 md:px-8">
        <div>
          <Logo variant="full" size="lg" />
          <p className="mt-4 max-w-xs text-sm font-medium text-accent">{STORE_SLOGAN}</p>
          <p className="mt-1.5 max-w-xs text-sm text-ink-soft">
            Indumentaria, perfumería, cremas, tuppers y variedades en San Rafael, Mendoza.
          </p>
        </div>
        <div className="text-sm text-ink-soft">
          <p className="mb-2 font-medium text-ink">Horarios</p>
          <ul className="space-y-1">
            {STORE_HOURS.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span>{h.hours}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-ink-soft">
          <p className="mb-2 font-medium text-ink">Encontranos</p>
          <a
            href={MAPS_LINK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-2 hover:text-ink"
          >
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            {ADDRESS}
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 hover:text-ink"
          >
            <MessageCircle className="h-4 w-4 shrink-0" />
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-2 hover:text-ink"
          >
            <InstagramIcon className="h-4 w-4 shrink-0" />@{INSTAGRAM_HANDLE}
          </a>
        </div>
      </div>
      <div className="border-t border-line/70 py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Modas Vanina
      </div>
    </footer>
  );
}
