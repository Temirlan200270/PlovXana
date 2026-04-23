import { headers } from "next/headers";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import { PILOT_TENANT_ROW } from "@/lib/tenant/pilotTenant";
import { TenantRowSchema, type TenantRow } from "@/lib/validation/menu";

function isTenantSlug(value: string): boolean {
  return /^[a-z0-9-]{2,}$/.test(value);
}

/**
 * Тенант из Edge middleware header (x-tenant-slug). Это основной путь для host-based tenancy.
 */
export async function getTenantSlugFromHeader(): Promise<string | null> {
  const h = await headers();
  const value = (h.get("x-tenant-slug") ?? "").toLowerCase().trim();
  return value && isTenantSlug(value) ? value : null;
}

/**
 * Резолв slug по поддомену: plovxana.localhost → plovxana.
 * Для localhost / Vercel preview без поддомена — вернёт null (используйте slug из URL).
 */
export async function getTenantSlugFromHost(): Promise<string | null> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(
    ":",
  )[0];
  if (!host) return null;

  const parts = host.split(".");
  const first = parts[0]?.toLowerCase();
  if (!first || first === "www") return null;
  if (first === "localhost" || first === "127") return null;
  /* vercel.app: проект.vercel.app — один сегмент «проект», не тенант */
  if (parts.length < 2) return null;

  return first;
}

/**
 * Тенант из Supabase по slug (основной путь для маршрута /[slug]/...).
 */
export async function getTenantBySlug(slug: string): Promise<TenantRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("tenants")
    .select(
      "id, slug, name, logo_url, contact_phone, contact_email, address, currency, theme, is_active, home_config",
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("[getTenantBySlug]", error.message);
    return null;
  }
  if (!data) return null;

  const parsed = TenantRowSchema.safeParse(data);
  if (!parsed.success) {
    console.error("[getTenantBySlug] Zod", parsed.error.flatten());
    return null;
  }
  return parsed.data;
}

/**
 * Для страниц без slug в пути: поддомен → БД, иначе env NEXT_PUBLIC_DEFAULT_TENANT_SLUG.
 */
export async function getTenantFromHostOrDefault(): Promise<TenantRow | null> {
  const fromHeader = await getTenantSlugFromHeader();
  const fromHost = fromHeader ?? (await getTenantSlugFromHost());
  const slug =
    fromHost ?? process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG ?? "plovxana";
  return getTenantBySlug(slug);
}

/**
 * Тенант для главной `/`: поддомен или дефолтный slug → Supabase; иначе пилотный fallback.
 * Не бросает: при пустой БД вернёт PILOT_TENANT_ROW (с предупреждением в лог).
 */
export async function getTenant(): Promise<TenantRow> {
  if (!isSupabaseConfigured()) {
    // Во время `next build` (пререндер) нельзя падать из-за отсутствующих runtime env.
    // Fail-closed остаётся для реального прод-рантайма.
    if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) {
      return PILOT_TENANT_ROW;
    }
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Tenant runtime: Supabase не настроен (в production fallback запрещён).",
      );
    }
    return PILOT_TENANT_ROW;
  }

  const row = await getTenantFromHostOrDefault();
  if (row) {
    return row;
  }

  // В проде fallback запрещён: если Supabase настроен, ожидаем, что tenants сидированы.
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Tenant runtime: активный тенант не найден (в production fallback запрещён).",
    );
  }

  console.warn(
    "[getTenant] Активный тенант в БД не найден — используется пилотный fallback (dev only).",
  );
  return PILOT_TENANT_ROW;
}
