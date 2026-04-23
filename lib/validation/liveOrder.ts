import { z } from "zod";
import { IdSchema } from "@/lib/validation/primitives";

/** Строка заказа для KDS / списков (подмножество колонок `orders`). */
export const LiveOrderRowSchema = z.object({
  id: IdSchema,
  tenant_id: IdSchema,
  customer_name: z.string(),
  customer_phone: z.string(),
  currency: z.string(),
  total_amount: z.coerce.number().int(),
  status: z.string(),
  comment: z.string().nullable().optional(),
  order_type: z.string().nullable().optional(),
  created_at: z.coerce.string(),
});

export type LiveOrderRow = z.infer<typeof LiveOrderRowSchema>;
