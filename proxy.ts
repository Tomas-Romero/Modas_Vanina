import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { hasSupabaseConfig } from "@/lib/supabase/client";
import { updateSession } from "@/lib/supabase/proxyClient";

export async function proxy(request: NextRequest) {
  // No Supabase project yet -> admin panel runs in open demo mode so it
  // stays fully clickable/testable until real credentials are added.
  if (!hasSupabaseConfig()) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin";

  if (!user && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/productos", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
