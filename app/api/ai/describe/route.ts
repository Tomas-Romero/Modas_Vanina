import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { describeImageSchema } from "@/lib/validation/product";
import { describeProductImage } from "@/lib/groq/describeImage";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = describeImageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  try {
    const description = await describeProductImage(parsed.data);
    return NextResponse.json({ description });
  } catch (err) {
    console.error("Groq describe error", err);
    return NextResponse.json({ error: "No se pudo generar la descripción." }, { status: 502 });
  }
}
