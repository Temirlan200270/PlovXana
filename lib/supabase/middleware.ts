import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
 * Инжект `x-tenant-slug` для публичного сайта (как в корневом middleware до админки).
 */
export function buildTenantRequestHeaders(request: NextRequest): Headers {
  const headers = new Headers(request.headers);
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";

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

/**
 * Обновление сессии Supabase на Edge + проброс заголовков тенанта.
 * Вызов `getUser()` обязателен для стабильного refresh cookie (не `getSession`).
 *
 * @todo Отложенно: при появлении странных разлогинов или потери `x-tenant-slug` на редиректах
 * свериться с последним гайдом Supabase SSR + Next.js (слияние кастомных заголовков и cookie
 * в одном `NextResponse.next({ request: { headers } })` и копирование cookies на redirect).
 */
export async function updateSession(request: NextRequest): Promise<{
  response: NextResponse;
  user: User | null;
}> {
  const requestHeaders = buildTenantRequestHeaders(request);

  if (!isSupabaseConfigured()) {
    return {
      response: NextResponse.next({ request: { headers: requestHeaders } }),
      user: null,
    };
  }

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>,
        ) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response: supabaseResponse, user: user ?? null };
}
