import type { SupabaseClient } from "@supabase/supabase-js";

export type TopOrderedItem = Readonly<{
  menuItemId: string;
  name: string;
  quantity: number;
  revenueTenge: number;
}>;

export type OrderAnalytics = Readonly<{
  revenueTenge: number;
  orderCount: number;
  topItems: TopOrderedItem[];
  periodDays: number;
  sinceIso: string;
}>;

/**
 * Агрегаты по заказам за период. Вызывать с клиентом под сессией staff (RLS ограничит tenant).
 */
export async function getOrderAnalytics(
  supabase: SupabaseClient,
  tenantId: string,
  periodDays: number,
): Promise<OrderAnalytics> {
  const days = Math.max(1, Math.min(366, periodDays));
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - days);
  since.setUTCHours(0, 0, 0, 0);
  const sinceIso = since.toISOString();

  const { data: orders, error: orderErr } = await supabase
    .from("orders")
    .select("id, total_amount")
    .eq("tenant_id", tenantId)
    .gte("created_at", sinceIso);

  if (orderErr) {
    throw new Error(orderErr.message);
  }

  const list = orders ?? [];
  const revenueTenge = list.reduce(
    (s, o) => s + (Number(o.total_amount) || 0),
    0,
  );
  const orderCount = list.length;
  const orderIds = list.map((o) => o.id);

  if (orderIds.length === 0) {
    return {
      revenueTenge: 0,
      orderCount: 0,
      topItems: [],
      periodDays: days,
      sinceIso,
    };
  }

  const { data: lines, error: lineErr } = await supabase
    .from("order_items")
    .select("menu_item_id, name, quantity, unit_price")
    .eq("tenant_id", tenantId)
    .in("order_id", orderIds);

  if (lineErr) {
    throw new Error(lineErr.message);
  }

  const byMenu = new Map<
    string,
    { name: string; quantity: number; revenueTenge: number }
  >();

  for (const row of lines ?? []) {
    const mid = row.menu_item_id as string;
    const qty = Number(row.quantity) || 0;
    const unit = Number(row.unit_price) || 0;
    const prev = byMenu.get(mid) ?? {
      name: String(row.name ?? "—"),
      quantity: 0,
      revenueTenge: 0,
    };
    prev.quantity += qty;
    prev.revenueTenge += unit * qty;
    byMenu.set(mid, prev);
  }

  const topItems: TopOrderedItem[] = [...byMenu.entries()]
    .map(([menuItemId, v]) => ({
      menuItemId,
      name: v.name,
      quantity: v.quantity,
      revenueTenge: v.revenueTenge,
    }))
    .sort((a, b) => b.revenueTenge - a.revenueTenge)
    .slice(0, 8);

  return {
    revenueTenge,
    orderCount,
    topItems,
    periodDays: days,
    sinceIso,
  };
}
