import { ImageResponse } from "next/og";
import { getLogoDataUri, LOGO_ASPECT_RATIO } from "@/lib/logo-asset";

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
  const logoSrc = await getLogoDataUri(px > 96 ? "lg" : "sm");
  const markHeight = Math.round(px * 0.72);
  const markWidth = Math.round(markHeight * LOGO_ASPECT_RATIO);

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={markWidth} height={markHeight} alt="" />
      </div>
    ),
    { width: px, height: px },
  );
}
