import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/supabase/requireAdmin";
import { hasCloudinaryConfig, signUpload } from "@/lib/cloudinary/signature";

export async function POST() {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: admin.status });
  }

  if (!hasCloudinaryConfig()) {
    return NextResponse.json(
      { error: "Cloudinary no está configurado todavía." },
      { status: 501 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "modas-vanina/productos";
  const { signature, apiKey, cloudName } = signUpload({ timestamp, folder });

  return NextResponse.json({ signature, timestamp, apiKey, cloudName, folder });
}
