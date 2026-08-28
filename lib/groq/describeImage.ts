import Groq from "groq-sdk";

export function hasGroqConfig(): boolean {
  return Boolean(process.env.GROQ_API_KEY && process.env.GROQ_VISION_MODEL);
}

const SYSTEM_PROMPT =
  "Sos un redactor de catálogo para una tienda de indumentaria, perfumería, cremas, tuppers y variedades en Argentina. " +
  "A partir de una o más fotos de un producto, escribís una descripción breve (2 a 3 frases), cálida y atractiva, en español rioplatense. " +
  "Nunca mencionás precios. Nunca inventás materiales, talles ni marcas que no se vean con claridad en la foto. " +
  "Devolvés solo el texto de la descripción, sin comillas ni encabezados.";

export async function describeProductImage({
  imageUrls,
  productName,
  category,
}: {
  imageUrls: string[];
  productName?: string;
  category?: string;
}): Promise<string> {
  if (!hasGroqConfig()) {
    return `[Descripción de muestra — configurá GROQ_API_KEY y GROQ_VISION_MODEL para generar una real] ${productName ?? "Este producto"} es una gran opción de nuestro catálogo${category ? ` de ${category}` : ""}. Calidad y estilo pensados para el día a día.`;
  }

  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const contextLine = [productName, category].filter(Boolean).join(" — ");

  const response = await groq.chat.completions.create({
    model: process.env.GROQ_VISION_MODEL!,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: contextLine
              ? `Datos conocidos del producto: ${contextLine}. Escribí la descripción a partir de la(s) foto(s).`
              : "Escribí la descripción a partir de la(s) foto(s).",
          },
          ...imageUrls.map((url) => ({
            type: "image_url" as const,
            image_url: { url },
          })),
        ],
      },
    ],
    temperature: 0.6,
    max_tokens: 300,
    // Qwen3 models "think" before answering by default, which can burn the
    // whole token budget on an invisible reasoning trace and leave the
    // visible description empty. `none` turns that off for qwen3 models;
    // harmless to leave set if GROQ_VISION_MODEL later points at a
    // non-reasoning model, since Groq ignores params a model doesn't use.
    reasoning_effort: "none",
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq no devolvió una descripción.");
  return text;
}
