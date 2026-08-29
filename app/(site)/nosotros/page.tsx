import { MapPin, MessageCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { LogoMark } from "@/components/layout/Logo";
import { RevealSection } from "@/components/home/RevealSection";
import {
  ADDRESS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MAPS_EMBED_URL,
  MAPS_LINK_URL,
  STORE_HOURS,
  STORE_SLOGAN,
  STORE_STORY,
  WHATSAPP_DISPLAY,
  WHATSAPP_NUMBER,
} from "@/lib/constants";

export const metadata = {
  title: "Nosotros",
  description:
    "Historia, dirección, horarios y contacto de Modas Vanina en San Rafael, Mendoza.",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="flex justify-center">
        <LogoMark size="lg" />
      </div>
      <p className="mt-4 text-center text-sm font-medium text-accent">{STORE_SLOGAN}</p>
      <h1 className="mt-2 text-center font-display text-2xl text-ink md:text-3xl">Nuestra historia</h1>
      <p className="mx-auto mt-4 max-w-xl text-balance text-center leading-relaxed text-ink-soft">
        {STORE_STORY}
      </p>

      <RevealSection className="mt-8 overflow-hidden rounded-2xl border border-line">
        <iframe
          title="Ubicación de Modas Vanina"
          src={MAPS_EMBED_URL}
          className="h-64 w-full grayscale-[15%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </RevealSection>

      <RevealSection className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-soft">
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

        <div className="rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-soft">
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
      </RevealSection>

      <RevealSection className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="whatsapp" size="lg" className="w-full">
            <MessageCircle className="h-4 w-4" /> {WHATSAPP_DISPLAY}
          </Button>
        </a>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            <InstagramIcon className="h-4 w-4" /> @{INSTAGRAM_HANDLE}
          </Button>
        </a>
      </RevealSection>
    </div>
  );
}
