import Image from "next/image";
import type { Category } from "@/lib/types";
import { PlaceholderArt, isPlaceholderImage, parsePlaceholderImage } from "./PlaceholderArt";

export function ProductImage({
  src,
  alt,
  category,
  sizes,
  className,
  priority,
}: {
  src: string | undefined;
  alt: string;
  category: Category;
  sizes?: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src || isPlaceholderImage(src)) {
    const { category: placeholderCategory, seed } = src
      ? parsePlaceholderImage(src)
      : { category, seed: 0 };
    return <PlaceholderArt category={placeholderCategory} seed={seed} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 768px) 33vw, 50vw"}
      className={className}
      priority={priority}
    />
  );
}
