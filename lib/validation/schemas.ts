import { z } from "zod";
import { TenantRowSchema } from "@/lib/validation/menu";
import { IdSchema } from "@/lib/validation/primitives";

export { IdSchema };

/** Временные метки для ответов API (частично — пока не все таблицы отдают updated_at). */
export const TimestampSchema = z.object({
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()).optional(),
});

/** Тенант в ответах API / строка `organizations` БД бота. */
export const TenantResponseSchema = TenantRowSchema.merge(
  TimestampSchema.partial(),
);

export type TenantResponse = z.infer<typeof TenantResponseSchema>;
