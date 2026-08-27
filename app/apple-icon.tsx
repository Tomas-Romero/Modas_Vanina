import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1B1512",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 80,
            fontWeight: 700,
            fontFamily: "serif",
            color: "#E0B674",
          }}
        >
          MV
        </div>
      </div>
    ),
    { ...size },
  );
}
