import { headers } from "next/headers";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { createSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { PILOT_TENANT_ROW } from "@/lib/tenant/pilotTenant";
import { TenantRowSchema, type TenantRow } from "@/lib/validation/menu";

function isTenantSlug(value: string): boolean {
  return /^[a-z0-9-]{2,}$/.test(value);
}

/**
 * Тенант из Edge middleware header (`x-tenant-slug`).
 * Основной путь для host-based / path-based tenancy.
 */
export async function getTenantSlugFromHeader(): Promise<string | null> {
  const h = await headers();
  const value = (h.get("x-tenant-slug") ?? "").toLowerCase().trim();
  return value && isTenantSlug(value) ? value : null;
}

/**
 * Резолв slug по поддомену: plovxana.example.com → plovxana.
 * Для localhost / Vercel preview без поддомена — null.
 */
export async function getTenantSlugFromHost(): Promise<string | null> {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(":")[0];
  if (!host) return null;

  const parts = host.split(".");
  const first = parts[0]?.toLowerCase();
  if (!first || first === "www") return null;
  if (first === "localhost" || first === "127") return null;
  if (parts.length < 2) return null;

  return first;
}

/**
 * Маппит строку `organizations` из БД бота в TenantRow для UI.
 * `id` приводится к строке, `currency` — fallback "KZT".
 */
function mapOrganizationRow(row: Record<string, unknown>): unknown {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    logo_url: null,
    contact_phone: null,
    contact_email: null,
    address: null,
    currency: row.currency ?? "KZT",
    theme: null,
    is_active: true,
    home_config: null,
    telegram_chat_id: row.telegram_ops_chat_id ?? null,
  };
}

/**
 * Тенант (organization) по slug — основной путь для маршрутов сайта.
 * Только чтение; пишет в БД исключительно бот.
 */
export async function getTenantBySlug(slug: string): Promise<TenantRow | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createSupabaseAnonServerClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id, slug, name, currency, telegram_ops_chat_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[getTenantBySlug] organizations error:", error.message);
    return null;
  }
  if (!data) return null;

  const parsed = TenantRowSchema.safeParse(mapOrganizationRow(data));
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
 * Тенант для главной `/`:
 *   - есть Supabase + строка в `organizations` → реальные данные;
 *   - нет Supabase → пилотный fallback (только в dev / на этапе build);
 *   - в проде без строки бросаем (fail-closed), чтобы не показывать кривое.
 */
export async function getTenant(): Promise<TenantRow> {
  if (!isSupabaseConfigured()) {
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

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Tenant runtime: organization не найдена. Проверьте, что в public.organizations есть строка с нужным slug.",
    );
  }

  console.warn(
    "[getTenant] organization не найдена в БД — используется пилотный fallback (dev only).",
  );
  return PILOT_TENANT_ROW;
}
