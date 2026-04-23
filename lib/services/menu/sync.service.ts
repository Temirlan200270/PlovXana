import type { Result } from "@/lib/utils/result";
import { fail, ok } from "@/lib/utils/result";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getMenu } from "@/lib/services/iiko/api";

type DbCategoryUpsert = {
  tenant_id: string;
  iiko_id: string;
  name: string;
  sort_order: number;
  is_visible: boolean;
};

type DbMenuItemUpsert = {
  tenant_id: string;
  iiko_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  is_popular: boolean;
};

export async function syncMenuWithIiko(
  tenantId: string,
  organizationId: string,
): Promise<Result<{ updated: number }>> {
  const supabase = createSupabaseAdminClient();

  const iikoData = await getMenu(organizationId);
  if (!iikoData.success) return iikoData;

  try {
    const { categories, products } = iikoData.data;

    const categoryUpserts: DbCategoryUpsert[] = categories.map((cat) => ({
      tenant_id: tenantId,
      iiko_id: cat.id,
      name: cat.name,
      sort_order: 0,
      is_visible: true,
    }));

    if (categoryUpserts.length > 0) {
      const { error: catError } = await supabase
        .from("categories")
        .upsert(categoryUpserts, { onConflict: "iiko_id" });
      if (catError) throw catError;
    }

    const { data: dbCategories, error: mapError } = await supabase
      .from("categories")
      .select("id, iiko_id")
      .eq("tenant_id", tenantId);

    if (mapError) throw mapError;

    const catMap = new Map<string, string>();
    for (const c of dbCategories ?? []) {
      const iikoId = (c as { iiko_id?: string | null }).iiko_id ?? null;
      const id = (c as { id?: string }).id ?? null;
      if (iikoId && id) catMap.set(iikoId, id);
    }

    const productUpserts: DbMenuItemUpsert[] = products.map((prod) => ({
      tenant_id: tenantId,
      iiko_id: prod.id,
      category_id: prod.parentGroup ? catMap.get(prod.parentGroup) ?? null : null,
      name: prod.name,
      description: prod.description?.trim() ? prod.description : null,
      price: prod.price,
      image_url: prod.imageLinks[0]?.trim() ? prod.imageLinks[0] : null,
      is_available: true,
      is_popular: false,
    }));

    if (productUpserts.length > 0) {
      const { error: prodError } = await supabase
        .from("menu_items")
        .upsert(productUpserts, { onConflict: "iiko_id" });
      if (prodError) throw prodError;
    }

    return ok({ updated: productUpserts.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown sync error";
    console.error("[syncMenuWithIiko]", message);
    return fail(`Ошибка синхронизации: ${message}`);
  }
}

