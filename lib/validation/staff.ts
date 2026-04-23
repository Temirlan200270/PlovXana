import { z } from "zod";
import { IdSchema } from "@/lib/validation/primitives";

/** Допустимые роли персонала (согласовано с миграцией staff_role_check). */
export const StaffRoleSchema = z.enum(["owner", "manager", "chef"]);

export type StaffRole = z.infer<typeof StaffRoleSchema>;

export const StaffRowSchema = z.object({
  id: IdSchema,
  user_id: IdSchema,
  tenant_id: IdSchema,
  role: StaffRoleSchema,
  created_at: z.string().datetime().or(z.date()),
});

export type StaffRow = z.infer<typeof StaffRowSchema>;

/** Ответ join с tenants для UI админки. */
export const StaffWithTenantSchema = StaffRowSchema.extend({
  tenants: z
    .object({
      name: z.string().nullable().optional(),
      slug: z.string().nullable().optional(),
      currency: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type StaffWithTenant = z.infer<typeof StaffWithTenantSchema>;
