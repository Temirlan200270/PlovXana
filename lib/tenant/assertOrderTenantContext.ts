import { isSupabaseConfigured } from "@/lib/supabase/server";
import { PILOT_TENANT_LOCAL_ID, PILOT_TENANT_ROW } from "@/lib/tenant/pilotTenant";
import { getTenantBySlug, getTenantSlugFromHeader } from "@/lib/tenant/getTenant";

/**
 * Проверяет, что `tenant_id` из клиентского payload совпадает с тенантом,
 * выведенным из запроса (поддомен / путь `x-tenant-slug` / дефолтный slug).
 * Защита от подстановки чужого UUID в Server Action.
 */
export async function assertTenantIdMatchesOrderContext(
  claimedTenantId: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const headerSlug = await getTenantSlugFromHeader();
  const fallbackSlug =
    process.env.NEXT_PUBLIC_DEFAULT_TENANT_SLUG?.trim() || "plovxana";
  const slug = headerSlug ?? fallbackSlug;

  if (!isSupabaseConfigured()) {
    if (claimedTenantId === PILOT_TENANT_LOCAL_ID) {
      return { ok: true };
    }
    return {
      ok: false,
      message: "Некорректный идентификатор заведения для текущего режима.",
    };
  }

  const tenant = await getTenantBySlug(slug);
  if (!tenant) {
    if (
      process.env.NODE_ENV !== "production" &&
      claimedTenantId === PILOT_TENANT_LOCAL_ID &&
      slug === PILOT_TENANT_ROW.slug
    ) {
      return { ok: true };
    }
    return { ok: false, message: "Активное заведение не найдено." };
  }

  if (tenant.id !== claimedTenantId) {
    return {
      ok: false,
      message:
        "Заказ можно оформить только в контексте текущего заведения. Обновите страницу и попробуйте снова.",
    };
  }

  return { ok: true };
}
