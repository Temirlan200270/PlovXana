import type { NextRequest } from "next/server";

const TENANT_SLUG_RE = /^[a-z0-9-]{2,}$/;

function extractTenantSlugFromHost(host: string): string | null {
  const cleaned = host.split(":")[0]?.toLowerCase() ?? "";
  if (!cleaned) return null;

  const parts = cleaned.split(".");
  const first = parts[0];
  if (!first || first === "www") return null;
  if (first === "localhost") return null;
  if (parts.length < 2) return null;

  if (parts.length === 4 && parts.every((p) => /^\d{1,3}$/.test(p))) {
    return null;
  }

  if (/^\d+$/.test(first)) return null;

  return TENANT_SLUG_RE.test(first) ? first : null;
}

/**
 * Инжект `x-tenant-slug` для публичного сайта.
 * Источник — только поддомен (`plovxana.example.com`).
 * Path-based детект отключён умышленно: пути вида `/privacy`, `/menu`, `/api`
 * иначе ошибочно распознаются как slug тенанта (false positive).
 * Маршрут `/[slug]/menu` берёт slug напрямую из `params` страницы.
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
  }

  return headers;
}
