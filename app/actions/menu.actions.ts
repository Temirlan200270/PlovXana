"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { MENU_ITEMS_CACHE_TAG, menuTenantCacheTag } from "@/lib/cache/tags";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { IdSchema } from "@/lib/validation/primitives";

const ToggleAvailabilitySchema = z.object({
  itemId: IdSchema,
  isAvailable: z.boolean(),
});

export type ToggleMenuItemAvailabilityResult =
  | { success: true }
  | { success: false; message: string };

/**
 * Стоп-лист: UPDATE под RLS staff; затем сброс кэша меню.
 * Не использует service_role — права задаёт политика `menu_items_staff_update`.
 */
export async function toggleMenuItemAvailability(
  payload: unknown,
): Promise<ToggleMenuItemAvailabilityResult> {
  const parsed = ToggleAvailabilitySchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: "Некорректные данные." };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "Требуется вход." };
  }

  const { data: row, error: selectError } = await supabase
    .from("menu_items")
    .select("id, tenant_id")
    .eq("id", parsed.data.itemId)
    .maybeSingle();

  if (selectError || !row) {
    return { success: false, message: "Позиция не найдена." };
  }

  const { error: updateError } = await supabase
    .from("menu_items")
    .update({ is_available: parsed.data.isAvailable })
    .eq("id", parsed.data.itemId);

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  revalidateTag(MENU_ITEMS_CACHE_TAG);
  revalidateTag(menuTenantCacheTag(row.tenant_id));

  return { success: true };
}
