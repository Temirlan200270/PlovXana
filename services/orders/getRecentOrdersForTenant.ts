import type { SupabaseClient } from "@supabase/supabase-js";
import {
  LiveOrderRowSchema,
  type LiveOrderRow,
} from "@/lib/validation/liveOrder";

/**
 * Последние заказы тенанта для SSR админки (RLS: только staff своего tenant).
 */
export async function getRecentOrdersForTenant(
  supabase: SupabaseClient,
  tenantId: string,
  limit: number = 50,
): Promise<readonly LiveOrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, tenant_id, customer_name, customer_phone, currency, total_amount, status, comment, order_type, created_at",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[getRecentOrdersForTenant]", error.message);
    return [];
  }

  const parsed = LiveOrderRowSchema.array().safeParse(data ?? []);
  if (!parsed.success) {
    console.error("[getRecentOrdersForTenant] Zod", parsed.error.flatten());
    return [];
  }
  return parsed.data;
}
