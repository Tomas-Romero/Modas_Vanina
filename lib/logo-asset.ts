import { readFile } from "node:fs/promises";
import path from "node:path";

// Server-only: embeds the real logo artwork as a data URI for the
// ImageResponse-based icon/OG generators (Satori can't fetch a relative
// /public URL at render time, but it can render an inline data: image).
let cachedSmall: string | null = null;
let cachedLarge: string | null = null;

async function toDataUri(filename: string): Promise<string> {
  const buf = await readFile(path.join(process.cwd(), "public", filename));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

export async function getLogoDataUri(size: "sm" | "lg" = "sm"): Promise<string> {
  if (size === "lg") {
    cachedLarge ??= await toDataUri("logo-mark.png");
    return cachedLarge;
  }
  cachedSmall ??= await toDataUri("logo-mark-sm.png");
  return cachedSmall;
}

export const LOGO_ASPECT_RATIO = 640 / 537;
