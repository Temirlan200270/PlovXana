import { NextResponse, type NextRequest } from "next/server";
import { buildTenantRequestHeaders } from "@/lib/supabase/middleware";

/**
 * Только tenant resolution через `x-tenant-slug`.
 * Аутентификация и `/admin/*` больше не используются (сайт — read-only витрина).
 */
export function middleware(request: NextRequest) {
  const headers = buildTenantRequestHeaders(request);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
