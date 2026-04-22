import { createSupabaseServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type CreateOrderResult =
  | Readonly<{ ok: true; orderId: string }>
  | Readonly<{ ok: false; error: string }>;

type OrdersInsertRow = {
  tenant_id: string;
  customer_name: string;
  customer_phone: string;
  currency: string;
  total_amount: number;
  status: string;
};

type OrderItemsInsertRow = {
  order_id: string;
  tenant_id: string;
  menu_item_id: string;
  name: string;
  unit_price: number;
  quantity: number;
};

// Legacy сервис (до перехода на server-owned pricing).
// Write-path v1 реализован в `app/actions/order.actions.ts`.
export async function createOrder(): Promise<CreateOrderResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase не настроен (переменные окружения)." };
  }

  // Заглушка: оставляем минимально компилируемым и явным.
  void createSupabaseServerClient;
  return { ok: false, error: "Используйте submitOrderAction (app/actions/order.actions.ts)" };
}

