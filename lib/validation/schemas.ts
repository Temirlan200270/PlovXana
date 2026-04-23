import { z } from "zod";
import { TenantRowSchema } from "@/lib/validation/menu";
import { IdSchema } from "@/lib/validation/primitives";

export { IdSchema };
export {
  StaffRoleSchema,
  StaffRowSchema,
  StaffWithTenantSchema,
  type StaffRole,
  type StaffRow,
  type StaffWithTenant,
} from "@/lib/validation/staff";

/** Временные метки для ответов API (частично — пока не все таблицы отдают updated_at). */
export const TimestampSchema = z.object({
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()).optional(),
});

/**
 * Тенант в ответах API / строка из `tenants`.
 * Имя согласовано с `zod_schemas.md` §2; структура `theme` — контракт v1 (`TenantThemeSchema`),
 * а не плоский `primary_color` из черновика документа.
 */
export const TenantResponseSchema = TenantRowSchema.merge(
  TimestampSchema.partial(),
);

export type TenantResponse = z.infer<typeof TenantResponseSchema>;
