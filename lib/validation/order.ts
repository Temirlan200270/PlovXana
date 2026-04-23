import { z } from "zod";
import { IdSchema, PhoneSchema } from "@/lib/validation/primitives";

export { PhoneSchema };

export const OrderItemDraftSchema = z.object({
  menu_item_id: IdSchema,
  quantity: z.number().int().positive("Количество должно быть больше нуля"),
  /** Выбранные модификаторы; цены пересчитываются на сервере. */
  modifier_ids: z.array(IdSchema).max(50).optional().default([]),
});

export const CheckoutDraftSchema = z.object({
  tenant_id: IdSchema,
  customer_name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100),
  customer_phone: PhoneSchema,
  comment: z.string().max(300, "Комментарий слишком длинный").optional(),
  items: z.array(OrderItemDraftSchema).min(1, "Корзина пуста"),
  order_type: z.enum(["delivery", "pickup", "hall"]).default("delivery"),
});

export type OrderItemDraft = z.infer<typeof OrderItemDraftSchema>;
export type CheckoutDraft = z.infer<typeof CheckoutDraftSchema>;

