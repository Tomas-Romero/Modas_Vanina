import type { MetadataRoute } from "next";
import { STORE_NAME } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${STORE_NAME} — Catálogo`,
    short_name: STORE_NAME,
    description:
      "Indumentaria, perfumería, cremas, tuppers y variedades en San Rafael, Mendoza.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B1512",
    theme_color: "#1B1512",
    lang: "es-AR",
    icons: [
      { src: "/icon/small", sizes: "48x48", type: "image/png" },
      { src: "/icon/large", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/xlarge", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
