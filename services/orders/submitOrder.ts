import type { SupabaseClient } from "@supabase/supabase-js";
import {
  logOrderSubmitStructured,
  tryWriteOrderAudit,
} from "@/lib/audit/orderSubmitAudit";
import {
  buildOrderTelegramText,
  sendTelegramMessage,
} from "@/lib/integrations/telegram";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import type { CheckoutDraft } from "@/lib/validation/order";
import { moneyToIntTenge } from "@/lib/domain/order-money";
import type { Result } from "@/lib/utils/result";
import { fail, ok } from "@/lib/utils/result";

type ModifierMeta = Readonly<{
  id: string;
  groupId: string;
  name: string;
  price: number;
}>;

type GroupMeta = Readonly<{
  id: string;
  minSelection: number;
  maxSelection: number;
  modifierIds: ReadonlySet<string>;
}>;

/**
 * Загружает метаданные модификаторов для позиции: группы, ограничения min/max, цены.
 */
async function loadModifierContextForItem(
  supabase: SupabaseClient,
  menuItemId: string,
  tenantId: string,
): Promise<
  Readonly<{ groups: GroupMeta[]; modifierById: Map<string, ModifierMeta> }>
> {
  const { data: links, error: linkError } = await supabase
    .from("menu_item_modifiers")
    .select("modifier_group_id")
    .eq("menu_item_id", menuItemId);

  if (linkError) {
    logOrderSubmitStructured("error", "menu_item_modifiers", {
      tenantId,
      message: linkError.message,
      extra: { menuItemId },
    });
    return { groups: [], modifierById: new Map() };
  }

  const groupIds = [...new Set((links ?? []).map((l) => l.modifier_group_id))];
  if (groupIds.length === 0) {
    return { groups: [], modifierById: new Map() };
  }

  const { data: rawGroups, error: groupError } = await supabase
    .from("modifier_groups")
    .select("id, tenant_id, min_selection, max_selection")
    .eq("tenant_id", tenantId)
    .in("id", groupIds);

  if (groupError) {
    logOrderSubmitStructured("error", "modifier_groups", {
      tenantId,
      message: groupError.message,
      extra: { menuItemId },
    });
    return { groups: [], modifierById: new Map() };
  }

  const { data: rawMods, error: modError } = await supabase
    .from("modifiers")
    .select("id, group_id, name, price, is_available")
    .in("group_id", groupIds);

  if (modError) {
    logOrderSubmitStructured("error", "modifiers", {
      tenantId,
      message: modError.message,
      extra: { menuItemId },
    });
    return { groups: [], modifierById: new Map() };
  }

  const mods = (rawMods ?? []).filter((m) => m.is_available !== false);
  const modifierById = new Map<string, ModifierMeta>();
  const modsByGroup = new Map<string, typeof mods>();

  for (const m of mods) {
    modifierById.set(m.id, {
      id: m.id,
      groupId: m.group_id,
      name: m.name,
      price: Number(m.price),
    });
    const list = modsByGroup.get(m.group_id) ?? [];
    list.push(m);
    modsByGroup.set(m.group_id, list);
  }

  const groups: GroupMeta[] = (rawGroups ?? []).map((g) => {
    const ids = (modsByGroup.get(g.id) ?? []).map((m) => m.id);
    return {
      id: g.id,
      minSelection: g.min_selection ?? 0,
      maxSelection: g.max_selection ?? 1,
      modifierIds: new Set(ids),
    };
  });

  return { groups, modifierById };
}

function validateModifierSelection(
  selectedIds: readonly string[],
  ctx: Readonly<{ groups: GroupMeta[]; modifierById: Map<string, ModifierMeta> }>,
): string | null {
  const unique = [...new Set(selectedIds)];
  if (unique.length !== selectedIds.length) {
    return "Дублируются модификаторы в одной позиции.";
  }

  const validIds = new Set<string>();
  for (const g of ctx.groups) {
    for (const id of g.modifierIds) validIds.add(id);
  }

  for (const id of unique) {
    if (!ctx.modifierById.has(id)) {
      return "Выбран недопустимый модификатор.";
    }
    if (!validIds.has(id)) {
      return "Модификатор не относится к этой позиции.";
    }
  }

  for (const g of ctx.groups) {
    const count = unique.filter((id) => g.modifierIds.has(id)).length;
    if (count < g.minSelection || count > g.maxSelection) {
      return "Неверное количество опций в группе модификаторов.";
    }
  }

  return null;
}

/**
 * Создаёт заказ в Supabase: цены и модификаторы считаются на сервере по данным БД.
 */
export async function submitCheckoutOrder(
  draft: CheckoutDraft,
): Promise<Result<{ orderId: string }>> {
  if (!isSupabaseConfigured()) {
    return fail("Supabase не настроен.");
  }
  if (!isSupabaseAdminConfigured()) {
    return fail(
      "Оформление заказа недоступно: на сервере не задан SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const supabase: SupabaseClient = createSupabaseAdminClient();
  const tenantId = draft.tenant_id;

  const menuItemIds = [...new Set(draft.items.map((i) => i.menu_item_id))];
  const { data: menuRows, error: menuError } = await supabase
    .from("menu_items")
    .select("id, tenant_id, name, price, is_available")
    .eq("tenant_id", tenantId)
    .in("id", menuItemIds);

  if (menuError) {
    logOrderSubmitStructured("error", "menu_items_load", {
      tenantId,
      message: menuError.message,
      extra: { menuItemCount: menuItemIds.length },
    });
    await tryWriteOrderAudit({
      tenantId,
      action: "order_submit_failed",
      metadata: { stage: "menu_items_load", error: menuError.message },
    });
    return fail("Не удалось загрузить меню.");
  }

  const menuById = new Map((menuRows ?? []).map((r) => [r.id, r]));
  if (menuById.size !== menuItemIds.length) {
    return fail("В корзине есть позиции из другого меню или устаревший каталог.");
  }

  for (const row of menuById.values()) {
    if (row.is_available === false) {
      return fail("Некоторые позиции сейчас недоступны. Обновите меню.");
    }
  }

  const { data: tenantRow } = await supabase
    .from("tenants")
    .select("currency, name, telegram_chat_id")
    .eq("id", tenantId)
    .maybeSingle();

  const currency = (tenantRow?.currency ?? "KZT").trim() || "KZT";
  const tenantDisplayName = (tenantRow?.name ?? "Ресторан").trim() || "Ресторан";

  type LineSnapshot = Readonly<{
    menu_item_id: string;
    name: string;
    unit_price: number;
    quantity: number;
    modifiers: ReadonlyArray<Readonly<{ id: string; name: string; price: number }>>;
  }>;

  const lines: LineSnapshot[] = [];
  let total = 0;

  const modifierCtxCache = new Map<
    string,
    Awaited<ReturnType<typeof loadModifierContextForItem>>
  >();

  for (const line of draft.items) {
    const row = menuById.get(line.menu_item_id);
    if (!row) return fail("Позиция меню не найдена.");

    let ctx = modifierCtxCache.get(line.menu_item_id);
    if (!ctx) {
      ctx = await loadModifierContextForItem(
        supabase,
        line.menu_item_id,
        tenantId,
      );
      modifierCtxCache.set(line.menu_item_id, ctx);
    }

    const modErr = validateModifierSelection(line.modifier_ids ?? [], ctx);
    if (modErr) return fail(modErr);

    const base = Number(row.price);
    let extras = 0;
    const modSnapshots: Array<{ id: string; name: string; price: number }> = [];

    for (const mid of line.modifier_ids ?? []) {
      const meta = ctx.modifierById.get(mid);
      if (!meta) return fail("Ошибка сопоставления модификатора.");
      extras += meta.price;
      modSnapshots.push({ id: meta.id, name: meta.name, price: meta.price });
    }

    const unit = moneyToIntTenge(base + extras);
    total += unit * line.quantity;

    lines.push({
      menu_item_id: row.id,
      name: row.name,
      unit_price: unit,
      quantity: line.quantity,
      modifiers: modSnapshots,
    });
  }

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      tenant_id: tenantId,
      customer_name: draft.customer_name,
      customer_phone: draft.customer_phone,
      currency,
      total_amount: total,
      status: "pending",
      comment: draft.comment ?? null,
      order_type: draft.order_type,
    })
    .select("id")
    .single();

  if (orderError || !orderRow) {
    logOrderSubmitStructured("error", "orders_insert", {
      tenantId,
      message: orderError?.message ?? "no row returned",
      extra: { lineCount: lines.length, total },
    });
    await tryWriteOrderAudit({
      tenantId,
      action: "order_submit_failed",
      metadata: {
        stage: "orders_insert",
        error: orderError?.message ?? "no row returned",
        lineCount: lines.length,
        total_amount: total,
      },
    });
    return fail("Не удалось создать заказ. Попробуйте позже.");
  }

  const orderId = orderRow.id as string;

  const itemRows = lines.map((ln) => ({
    order_id: orderId,
    tenant_id: tenantId,
    menu_item_id: ln.menu_item_id,
    name: ln.name,
    unit_price: ln.unit_price,
    quantity: ln.quantity,
    modifiers: ln.modifiers,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemRows);

  if (itemsError) {
    logOrderSubmitStructured("error", "order_items_insert_rollback", {
      tenantId,
      orderId,
      message: itemsError.message,
      extra: { lineCount: itemRows.length },
    });
    await supabase.from("orders").delete().eq("id", orderId);
    await tryWriteOrderAudit({
      tenantId,
      action: "order_submit_rollback",
      orderId,
      metadata: {
        stage: "order_items_insert",
        error: itemsError.message,
        note: "order row deleted after failed line items",
      },
    });
    return fail("Не удалось сохранить состав заказа. Попробуйте ещё раз.");
  }

  logOrderSubmitStructured("info", "order_created", {
    tenantId,
    orderId,
    extra: {
      lineCount: lines.length,
      total_amount: total,
      currency,
    },
  });
  await tryWriteOrderAudit({
    tenantId,
    action: "order_submit_success",
    orderId,
    metadata: {
      line_count: lines.length,
      total_amount: total,
      currency,
    },
  });

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const envChat = process.env.TELEGRAM_CHAT_ID?.trim();
  const tenantChat = (tenantRow?.telegram_chat_id ?? "").trim();
  const chatId = tenantChat || envChat;
  if (botToken && chatId) {
    const text = buildOrderTelegramText({
      tenantName: tenantDisplayName,
      orderId,
      totalTenge: total,
      currency,
      customerName: draft.customer_name,
      customerPhone: draft.customer_phone,
      lineCount: lines.length,
    });
    void sendTelegramMessage({ botToken, chatId, text }).then((r) => {
      if (!r.ok) {
        logOrderSubmitStructured("warn", "telegram_notify_failed", {
          tenantId,
          orderId,
          message: r.message,
        });
      }
    });
  }

  return ok({ orderId });
}
