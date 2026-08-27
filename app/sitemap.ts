import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/catalogo", "/nosotros"];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/catalogo" ? "daily" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
