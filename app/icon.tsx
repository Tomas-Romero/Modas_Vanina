import { ImageResponse } from "next/og";

const SIZES: Record<string, number> = { small: 48, large: 192, xlarge: 512 };

export function generateImageMetadata() {
  return Object.entries(SIZES).map(([id, px]) => ({
    id,
    size: { width: px, height: px },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const px = SIZES[await id];

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
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: px * 0.46,
            fontWeight: 700,
            fontFamily: "serif",
            color: "#E0B674",
          }}
        >
          MV
        </div>
      </div>
    ),
    { width: px, height: px },
  );
}
