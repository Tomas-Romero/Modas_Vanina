import { ImageResponse } from "next/og";
import { getLogoDataUri, LOGO_ASPECT_RATIO } from "@/lib/logo-asset";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const logoSrc = await getLogoDataUri("lg");
  const markHeight = 128;
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
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={markWidth} height={markHeight} alt="" />
      </div>
    ),
    { ...size },
  );
}
