import type { NextRequest } from "next/server";

const TENANT_SLUG_RE = /^[a-z0-9-]{2,}$/;

function extractTenantSlugFromHost(host: string): string | null {
  const cleaned = host.split(":")[0]?.toLowerCase() ?? "";
  if (!cleaned) return null;

  const parts = cleaned.split(".");
  const first = parts[0];
  if (!first || first === "www") return null;
  if (first === "localhost" || first === "127") return null;
  if (parts.length < 2) return null;

  return TENANT_SLUG_RE.test(first) ? first : null;
}

/**
 * Инжект `x-tenant-slug` для публичного сайта.
 * Источник: поддомен или первый сегмент пути.
 */
export function buildTenantRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";

  const hostSlug = extractTenantSlugFromHost(host);
  if (hostSlug) {
    headers.set("x-tenant-slug", hostSlug);
    return headers;
  }

  const pathname = request.nextUrl.pathname;
  if (
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next") &&
    pathname !== "/favicon.ico"
  ) {
    const pathMatch = pathname.match(/^\/([a-z0-9-]{2,})(?:\/|$)/);
    const pathSlug = pathMatch?.[1];
    if (pathSlug) {
      headers.set("x-tenant-slug", pathSlug);
    }
  }

  return headers;
}
