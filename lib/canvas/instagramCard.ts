import { CATEGORY_LABELS, type Product } from "@/lib/types";

const WIDTH = 1080;
const HEIGHT = 1350;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement) {
  const imgRatio = img.width / img.height;
  const boxRatio = WIDTH / HEIGHT;
  let sx: number, sy: number, sw: number, sh: number;

  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, WIDTH, HEIGHT);
}

function drawFallbackBackground(ctx: CanvasRenderingContext2D) {
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  gradient.addColorStop(0, "#8C2F4B");
  gradient.addColorStop(1, "#A9793A");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  lines.slice(0, maxLines).forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
}

// Renders a 4:5 Instagram-feed-ready card for a product: cover photo (or a
// brand-colored fallback for placeholder/demo images) with the category,
// product name, and "MODAS VANINA" wordmark overlaid at the bottom. Runs
// entirely client-side via Canvas — no server round trip needed.
export async function generateInstagramCard(product: Product): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no soportado.");

  const photo = product.images[0];
  if (photo && !photo.startsWith("placeholder:")) {
    try {
      drawCover(ctx, await loadImage(photo));
    } catch {
      drawFallbackBackground(ctx);
    }
  } else {
    drawFallbackBackground(ctx);
  }

  const gradient = ctx.createLinearGradient(0, HEIGHT * 0.5, 0, HEIGHT);
  gradient.addColorStop(0, "rgba(27,21,18,0)");
  gradient.addColorStop(1, "rgba(27,21,18,0.94)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, HEIGHT * 0.5, WIDTH, HEIGHT * 0.5);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = "#E0B674";
  ctx.font = "600 32px Georgia, 'Times New Roman', serif";
  ctx.fillText(CATEGORY_LABELS[product.category].toUpperCase(), 64, HEIGHT - 260);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "700 66px Georgia, 'Times New Roman', serif";
  wrapText(ctx, product.name, 64, HEIGHT - 195, WIDTH - 128, 74, 2);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = "500 30px Georgia, 'Times New Roman', serif";
  ctx.fillText("M O D A S   V A N I N A", WIDTH / 2, HEIGHT - 55);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo generar la imagen."))),
      "image/jpeg",
      0.92,
    );
  });
}
