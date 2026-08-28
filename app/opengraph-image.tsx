import { ImageResponse } from "next/og";
import { STORE_NAME } from "@/lib/constants";
import { getLogoDataUri, LOGO_ASPECT_RATIO } from "@/lib/logo-asset";

export const alt = `${STORE_NAME} — Catálogo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoSrc = await getLogoDataUri("lg");
  const markHeight = 150;
  const markWidth = Math.round(markHeight * LOGO_ASPECT_RATIO);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1512",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={markWidth} height={markHeight} alt="" style={{ marginBottom: 8 }} />
        <div
          style={{
            fontSize: 24,
            letterSpacing: 16,
            textTransform: "uppercase",
            color: "#B7A99D",
            fontFamily: "serif",
          }}
        >
          Modas
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#F3ECE6",
            fontFamily: "serif",
          }}
        >
          Vanina
        </div>
        <div style={{ marginTop: 22, width: 140, height: 3, background: "#E0B674" }} />
        <div
          style={{
            marginTop: 32,
            fontSize: 24,
            color: "#B7A99D",
            fontFamily: "serif",
          }}
        >
          Indumentaria · Perfumería · Cremas · Tuppers · Varios
        </div>
      </div>
    ),
    { ...size },
  );
}
