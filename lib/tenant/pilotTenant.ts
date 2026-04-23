import type { TenantRow } from "@/lib/validation/menu";
import { BRAND_NAME } from "@/lib/branding";

/**
 * Стабильный UUID для пилота в локальной разработке без БД.
 * В проде при сидировании Supabase используйте тот же id или обновите строку tenants.
 */
export const PILOT_TENANT_LOCAL_ID =
  "a0000000-0000-4000-8000-000000000001";

/** Fallback-строка tenants, когда Supabase выключен или таблица ещё пуста. */
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
