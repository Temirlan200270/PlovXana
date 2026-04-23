import { z } from "zod";
import { IdSchema } from "@/lib/validation/primitives";
import { HomeConfigSchema } from "@/lib/validation/tenantLanding";
import { TenantThemeSchema } from "@/lib/validation/theme";

/** Строка тенанта из таблицы tenants. */
export const TenantRowSchema = z.object({
  id: IdSchema,
  slug: z.string().min(1),
  name: z.string().min(1),
  logo_url: z.string().nullable().optional(),
  contact_phone: z.string().nullable().optional(),
  contact_email: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  theme: TenantThemeSchema.nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  home_config: HomeConfigSchema.nullable().optional(),
  /** Не подставлять в публичный select без необходимости (уведомления на сервере). */
  telegram_chat_id: z.string().nullable().optional(),
});

export type TenantRow = z.infer<typeof TenantRowSchema>;

/** Строка категории из БД (см. database_schema.sql). */
export const CategoryRowSchema = z.object({
  id: IdSchema,
  tenant_id: IdSchema,
  name: z.string().min(1),
  sort_order: z.number().int().nullable().optional(),
  is_visible: z.boolean().nullable().optional(),
});

/** Позиция меню из БД; price из numeric может прийти строкой. */
export const MenuItemRowSchema = z.object({
  id: IdSchema,
  tenant_id: IdSchema,
  category_id: IdSchema.nullable(),
  name: z.string().min(1),
  description: z.string().nullable().optional(),
  price: z.coerce.number().nonnegative(),
  image_url: z.string().nullable().optional(),
  is_available: z.boolean().nullable().optional(),
  is_popular: z.boolean().nullable().optional(),
  attributes: z.record(z.unknown()).nullable().optional(),
});

export const CategoryRowsSchema = z.array(CategoryRowSchema);
export const MenuItemRowsSchema = z.array(MenuItemRowSchema);

/** Нормализованная категория с позициями для UI. */
/** Опция модификатора (строка из `modifiers`). */
export const MenuModifierOptionSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  is_available: z.boolean(),
});

/** Группа модификаторов с опциями для UI. */
export const MenuModifierGroupSchema = z.object({
  id: IdSchema,
  name: z.string().min(1),
  min_selection: z.number().int().nonnegative(),
  max_selection: z.number().int().nonnegative(),
  modifiers: z.array(MenuModifierOptionSchema),
});

export const MenuCategoryWithItemsSchema = z.object({
  id: IdSchema,
  name: z.string(),
  sort_order: z.number(),
  items: z.array(
    z.object({
      id: IdSchema,
      name: z.string(),
      description: z.string().nullable(),
      price: z.number(),
      image_url: z.string().nullable(),
      is_popular: z.boolean(),
      modifier_groups: z.array(MenuModifierGroupSchema).default([]),
    }),
  ),
});

export type MenuCategoryWithItems = z.infer<typeof MenuCategoryWithItemsSchema>;
