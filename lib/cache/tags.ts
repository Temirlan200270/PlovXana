/** Теги Data Cache Next.js для `revalidateTag` / `unstable_cache`. */
export const MENU_ITEMS_CACHE_TAG = "menu_items" as const;

export function menuTenantCacheTag(tenantId: string): string {
  return `menu-tenant-${tenantId}`;
}
