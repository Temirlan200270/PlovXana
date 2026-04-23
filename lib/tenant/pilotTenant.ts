import type { TenantRow } from "@/lib/validation/menu";
import { BRAND_NAME } from "@/lib/branding";

/**
 * Локальный fallback-id (используется только в dev без Supabase).
 * В проде сайт всегда читает organization из БД бота по slug.
 */
export const PILOT_TENANT_LOCAL_ID = "0";

/** Fallback-строка organization, когда Supabase выключен (только dev). */
export const PILOT_TENANT_ROW: TenantRow = {
  id: PILOT_TENANT_LOCAL_ID,
  slug: "plovxana",
  name: BRAND_NAME,
  logo_url: null,
  contact_phone: null,
  contact_email: null,
  address: null,
  currency: "KZT",
  theme: null,
  is_active: true,
  home_config: null,
  telegram_chat_id: null,
};
