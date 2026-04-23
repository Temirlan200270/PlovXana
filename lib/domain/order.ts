import { z } from "zod";

export const OrderIdSchema = z.string().uuid();
export type OrderId = z.infer<typeof OrderIdSchema>;

export type CurrencyCode = "KZT" | "USD";

export type OrderItemDraft = Readonly<{
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}>;

export type OrderDraft = Readonly<{
  tenantId: string;
  tenantSlug: string;
  currency: CurrencyCode;
  customerName: string;
  customerPhone: string;
  items: ReadonlyArray<OrderItemDraft>;
}>;

export function calculateOrderTotal(items: ReadonlyArray<OrderItemDraft>): number {
  let total = 0;
  for (const item of items) {
    total += item.unitPrice * item.quantity;
  }
  return total;
}

