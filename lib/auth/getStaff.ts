import type { SupabaseClient } from "@supabase/supabase-js";
import { StaffWithTenantSchema, type StaffWithTenant } from "@/lib/validation/staff";

/**
 * Загрузка строки staff + tenant для админки (RLS: только своя строка).
 */
export async function getStaffForUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<StaffWithTenant | null> {
  const { data, error } = await supabase
    .from("staff")
    .select("id, user_id, tenant_id, role, created_at, tenants(name, slug, currency)")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return null;

  const parsed = StaffWithTenantSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}
