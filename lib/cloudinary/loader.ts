"use client";

// Global next/image loader (wired via next.config.ts images.loaderFile).
// Cloudinary URLs are stored as full secure_url strings; we splice a
// transformation segment right after "/upload/" to get automatic
// format + quality + width, no next-cloudinary dependency needed.
export default function cloudinaryLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!src.includes("res.cloudinary.com") || !src.includes("/upload/")) {
    return src;
  }
  const transform = `f_auto,q_auto,w_${width}`;
  return src.replace("/upload/", `/upload/${transform}/`);
}
