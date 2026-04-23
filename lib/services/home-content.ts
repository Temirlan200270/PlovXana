import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import type { TenantRow } from "@/lib/validation/menu";
import {
  buildPublicConfigFromRow,
  getTenantConfig,
} from "@/lib/services/tenant.service";
import { isSupabaseConfigured } from "@/lib/supabase/server";

/**
 * Канонический публичный контент для главной: одна строка `TenantRow` (с `home_config`) → DTO без повторного запроса.
 */
export async function getHomePublicCopy(
  tenant: TenantRow,
): Promise<TenantPublicConfig> {
  if (!isSupabaseConfigured()) {
    return getTenantConfig(tenant.slug);
  }
  return buildPublicConfigFromRow(tenant);
}
