import { unstable_cache } from "next/cache";
import { MENU_ITEMS_CACHE_TAG, menuTenantCacheTag } from "@/lib/cache/tags";
import { createSupabaseAnonServerClient } from "@/lib/supabase/anon-server";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import {
  MenuCategoryWithItemsSchema,
  MenuItemRowsSchema,
  type MenuCategoryWithItems,
} from "@/lib/validation/menu";

export type GetMenuResult = {
  ok: boolean;
  menu: MenuCategoryWithItems[];
  error: string | null;
};

const FALLBACK_CATEGORY_NAME = "Меню";

/**
 * Приоритетные категории для вкладок меню.
 * Чем меньше индекс — тем раньше вкладка. Сравнение — по подстроке (lowercase).
 * Категории, которых нет в списке, идут в порядке появления,
 * а «акция/скидка/спецпредложение» уходят в самый конец.
 */
const CATEGORY_PRIORITY: readonly string[] = [
  "плов",
  "горячее",
  "основн",
  "шашлык",
  "закуск",
  "салат",
  "суп",
  "выпечк",
  "гарнир",
  "десерт",
  "напит",
  "детск",
];

const CATEGORY_DEPRIORITY: readonly string[] = [
  "акци",
  "скидк",
  "спецпредлож",
  "стоп",
];

function categoryRank(name: string): number {
  const lc = name.toLowerCase();
  for (let i = 0; i < CATEGORY_PRIORITY.length; i++) {
    if (lc.includes(CATEGORY_PRIORITY[i])) return i;
  }
  for (const kw of CATEGORY_DEPRIORITY) {
    if (lc.includes(kw)) return 1000;
  }
  return 500;
}

/**
 * Стабильный slug категории на основе её имени — нужен только для UI (key, tab id).
 */
function buildCategoryId(name: string): string {
  const base = name.trim().toLowerCase();
  return base.length > 0 ? `cat-${base.replace(/\s+/g, "-")}` : "cat-default";
}

/**
 * Чтение меню из БД бота (`public.menu_items`) для конкретной organization.
 * Группировка по строковому полю `category` (отдельной таблицы categories у бота нет).
 */
async function getMenuUncached(tenantId: string): Promise<GetMenuResult> {
  const supabase = createSupabaseAnonServerClient();
  // tenant.id у нас — строка, организация в БД бота — integer.
  const orgId = Number.parseInt(tenantId, 10);
  if (!Number.isFinite(orgId) || orgId <= 0) {
    return {
      ok: false,
      menu: [],
      error: "Некорректный идентификатор organization (ожидается positive integer).",
    };
  }

  const { data: rawItems, error: itemError } = await supabase
    .from("menu_items")
    .select(
      "id, organization_id, iiko_id, name, category, description, tags, price, image_url, is_available",
    )
    .eq("organization_id", orgId)
    .eq("is_available", true)
    // Исключаем позиции без цены (тестовые строки бота и инвентарные записи),
    // они приходят как price = 0 и ломают витрину.
    .gt("price", 0)
    .order("category", { ascending: true })
    .order("name", { ascending: true });

  if (itemError) {
    console.error("[getMenu] menu_items", itemError.message);
    return { ok: false, menu: [], error: itemError.message };
  }

  const itemsParsed = MenuItemRowsSchema.safeParse(rawItems ?? []);
  if (!itemsParsed.success) {
    console.error("[getMenu] Zod items", itemsParsed.error.flatten());
    return { ok: false, menu: [], error: "Некорректные данные позиций меню." };
  }

  const items = itemsParsed.data;
  /** Группировка по строке category. Сохраняем порядок появления. */
  const order: string[] = [];
  const grouped = new Map<string, typeof items>();
  for (const item of items) {
    const catName = (item.category ?? "").trim() || FALLBACK_CATEGORY_NAME;
    if (!grouped.has(catName)) {
      grouped.set(catName, []);
      order.push(catName);
    }
    grouped.get(catName)!.push(item);
  }

  /**
   * Сортируем имена категорий по приоритету бренда:
   *   - плов/горячее/основные вперёд;
   *   - «акция/скидка/стоп» в самый конец.
   * Внутри одной группы — исходный порядок появления (стабильная сортировка).
   */
  const sortedOrder = order
    .map((name, idx) => ({ name, idx, rank: categoryRank(name) }))
    .sort((a, b) => (a.rank === b.rank ? a.idx - b.idx : a.rank - b.rank))
    .map((x) => x.name);

  const menu: MenuCategoryWithItems[] = [];
  sortedOrder.forEach((catName, idx) => {
    const catItems = grouped.get(catName) ?? [];
    const normalized = {
      id: buildCategoryId(catName),
      name: catName,
      sort_order: idx,
      items: catItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description?.trim() ? item.description : null,
        price: Number(item.price),
        image_url: item.image_url?.trim() ? item.image_url : null,
        /* В БД бота нет флага «авторское» — используем эвристику: в category или tags ключевое слово. */
        is_popular: detectPopular(item.category, item.tags),
      })),
    };
    const finalCheck = MenuCategoryWithItemsSchema.safeParse(normalized);
    if (finalCheck.success) {
      menu.push(finalCheck.data);
    }
  });

  return { ok: true, menu, error: null };
}

/** Эвристика «популярное / авторское» по тегам и категории. */
function detectPopular(
  category: string | null | undefined,
  tags: string | null | undefined,
): boolean {
  const haystack = `${category ?? ""} ${tags ?? ""}`.toLowerCase();
  return /(popular|hit|хит|подпис|автор|signature)/.test(haystack);
}

/**
 * Меню тенанта с Data Cache + тегами для будущей инвалидации.
 */
export async function getMenu(tenantId: string): Promise<GetMenuResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      menu: [],
      error: "Supabase не настроен (проверьте NEXT_PUBLIC_SUPABASE_URL / KEY).",
    };
  }

  return unstable_cache(
    async () => getMenuUncached(tenantId),
    ["getMenu", tenantId],
    {
      tags: [MENU_ITEMS_CACHE_TAG, menuTenantCacheTag(tenantId)],
      revalidate: 60,
    },
  )();
}
