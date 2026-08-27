import { ImageResponse } from "next/og";
import { STORE_NAME } from "@/lib/constants";

export const alt = `${STORE_NAME} — Catálogo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
        <div
          style={{
            fontSize: 28,
            letterSpacing: 18,
            textTransform: "uppercase",
            color: "#B7A99D",
            fontFamily: "serif",
          }}
        >
          Modas
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 120,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#F3ECE6",
            fontFamily: "serif",
          }}
        >
          Vanina
        </div>
        <div style={{ marginTop: 28, width: 160, height: 3, background: "#E0B674" }} />
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
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
