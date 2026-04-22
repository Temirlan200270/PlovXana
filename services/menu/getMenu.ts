import { unstable_cache } from "next/cache";
import { MENU_ITEMS_CACHE_TAG, menuTenantCacheTag } from "@/lib/cache/tags";
import { createSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  CategoryRowsSchema,
  MenuCategoryWithItemsSchema,
  MenuItemRowsSchema,
  MenuModifierGroupSchema,
  type MenuCategoryWithItems,
} from "@/lib/validation/menu";
import type { z } from "zod";

export type GetMenuResult = {
  ok: boolean;
  menu: MenuCategoryWithItems[];
  error: string | null;
};

type ModifierGroupParsed = z.infer<typeof MenuModifierGroupSchema>;

/**
 * Загружает группы модификаторов и опции для позиций меню (если таблицы есть в БД).
 */
async function loadModifierGroupsForItems(
  supabase: SupabaseClient,
  tenantId: string,
  itemIds: string[],
): Promise<Map<string, ModifierGroupParsed[]>> {
  const result = new Map<string, ModifierGroupParsed[]>();
  if (itemIds.length === 0) return result;

  const { data: rawLinks, error: linkError } = await supabase
    .from("menu_item_modifiers")
    .select("menu_item_id, modifier_group_id")
    .in("menu_item_id", itemIds);

  if (linkError) {
    console.error("[getMenu] menu_item_modifiers", linkError.message);
    return result;
  }

  const links = rawLinks ?? [];
  if (links.length === 0) return result;

  const groupIds = [...new Set(links.map((l) => l.modifier_group_id))];

  const { data: rawGroups, error: groupError } = await supabase
    .from("modifier_groups")
    .select("id, tenant_id, name, min_selection, max_selection")
    .eq("tenant_id", tenantId)
    .in("id", groupIds);

  if (groupError) {
    console.error("[getMenu] modifier_groups", groupError.message);
    return result;
  }

  const { data: rawMods, error: modError } = await supabase
    .from("modifiers")
    .select("id, group_id, name, price, is_available")
    .in("group_id", groupIds);

  if (modError) {
    console.error("[getMenu] modifiers", modError.message);
    return result;
  }

  const groups = rawGroups ?? [];
  const mods = rawMods ?? [];

  const modsByGroup = new Map<string, typeof mods>();
  for (const m of mods) {
    const list = modsByGroup.get(m.group_id) ?? [];
    list.push(m);
    modsByGroup.set(m.group_id, list);
  }

  const groupById = new Map(groups.map((g) => [g.id, g]));

  const itemToGroupIds = new Map<string, string[]>();
  for (const l of links) {
    const arr = itemToGroupIds.get(l.menu_item_id) ?? [];
    if (!arr.includes(l.modifier_group_id)) arr.push(l.modifier_group_id);
    itemToGroupIds.set(l.menu_item_id, arr);
  }

  for (const itemId of itemIds) {
    const gids = itemToGroupIds.get(itemId) ?? [];
    const built: ModifierGroupParsed[] = [];
    for (const gid of gids) {
      const g = groupById.get(gid);
      if (!g) continue;
      const groupMods = (modsByGroup.get(gid) ?? [])
        .filter((m) => m.is_available !== false)
        .sort((a, b) => a.name.localeCompare(b.name, "ru"))
        .map((m) => ({
          id: m.id,
          name: m.name,
          price: Number(m.price),
          is_available: true,
        }));

      built.push({
        id: g.id,
        name: g.name,
        min_selection: g.min_selection ?? 0,
        max_selection: g.max_selection ?? 1,
        modifiers: groupMods,
      });
    }
    if (built.length > 0) result.set(itemId, built);
  }

  return result;
}

/**
 * Меню тенанта из Supabase: категории + доступные позиции.
 * Анонимный клиент (без `cookies`) — совместимо с `unstable_cache` и `revalidateTag`.
 */
async function getMenuUncached(tenantId: string): Promise<GetMenuResult> {
  const supabase = createSupabaseAnonServerClient();

  const { data: rawCategories, error: catError } = await supabase
    .from("categories")
    .select("id, tenant_id, name, sort_order, is_visible")
    .eq("tenant_id", tenantId)
    .order("sort_order", { ascending: true });

  if (catError) {
    console.error("[getMenu] categories", catError.message);
    return {
      ok: false,
      menu: [],
      error: catError.message,
    };
  }

  const { data: rawItems, error: itemError } = await supabase
    .from("menu_items")
    .select(
      "id, tenant_id, category_id, name, description, price, image_url, is_available, is_popular, attributes",
    )
    .eq("tenant_id", tenantId)
    .eq("is_available", true);

  if (itemError) {
    console.error("[getMenu] menu_items", itemError.message);
    return {
      ok: false,
      menu: [],
      error: itemError.message,
    };
  }

  const categoriesParsed = CategoryRowsSchema.safeParse(rawCategories ?? []);
  const itemsParsed = MenuItemRowsSchema.safeParse(rawItems ?? []);

  if (!categoriesParsed.success) {
    console.error("[getMenu] Zod categories", categoriesParsed.error.flatten());
    return {
      ok: false,
      menu: [],
      error: "Некорректные данные категорий.",
    };
  }
  if (!itemsParsed.success) {
    console.error("[getMenu] Zod items", itemsParsed.error.flatten());
    return {
      ok: false,
      menu: [],
      error: "Некорректные данные позиций меню.",
    };
  }

  const categories = categoriesParsed.data.filter(
    (c) => c.is_visible !== false,
  );
  const items = itemsParsed.data;

  let modifierByItemId = new Map<string, ModifierGroupParsed[]>();
  try {
    modifierByItemId = await loadModifierGroupsForItems(
      supabase,
      tenantId,
      items.map((i) => i.id),
    );
  } catch (e) {
    console.error("[getMenu] modifiers load", e);
  }

  const menu: MenuCategoryWithItems[] = [];

  for (const cat of categories) {
    const catItems = items.filter((item) => item.category_id === cat.id);
    const normalized = {
      id: cat.id,
      name: cat.name,
      sort_order: cat.sort_order ?? 0,
      items: catItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description ?? null,
        price: item.price,
        image_url: item.image_url?.trim() ? item.image_url : null,
        is_popular: item.is_popular === true,
        modifier_groups: modifierByItemId.get(item.id) ?? [],
      })),
    };
    const finalCheck = MenuCategoryWithItemsSchema.safeParse(normalized);
    if (finalCheck.success) {
      menu.push(finalCheck.data);
    }
  }

  return { ok: true, menu, error: null };
}

/**
 * Меню тенанта: кэш Data Cache с тегами для инвалидации после стоп-листа.
 */
export async function getMenu(tenantId: string): Promise<GetMenuResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      menu: [],
      error: "Supabase не настроен (переменные окружения).",
    };
  }

  return unstable_cache(
    async () => getMenuUncached(tenantId),
    ["getMenu", tenantId],
    {
      tags: [MENU_ITEMS_CACHE_TAG, menuTenantCacheTag(tenantId)],
    },
  )();
}
