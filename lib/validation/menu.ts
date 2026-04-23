import { z } from "zod";
import { IdSchema } from "@/lib/validation/primitives";
import { HomeConfigSchema } from "@/lib/validation/tenantLanding";
import { TenantThemeSchema } from "@/lib/validation/theme";

/**
 * Строка тенанта (для сайта = одна organization из БД бота).
 * `id` хранится как строка, чтобы не тащить тип БД (integer) в UI.
 */
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
  /** Не для публичного select; используется при отправке уведомлений на сервере. */
  telegram_chat_id: z.string().nullable().optional(),
});

export type TenantRow = z.infer<typeof TenantRowSchema>;

/**
 * Позиция меню из БД бота.
 * Категория хранится строкой в `menu_items.category` (без отдельной таблицы categories).
 */
export const MenuItemRowSchema = z.object({
  id: IdSchema,
  organization_id: IdSchema,
  iiko_id: z.string().nullable().optional(),
  name: z.string().min(1),
  category: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  tags: z.string().nullable().optional(),
  price: z.coerce.number().nonnegative(),
  image_url: z.string().nullable().optional(),
  is_available: z.boolean().nullable().optional(),
});

export const MenuItemRowsSchema = z.array(MenuItemRowSchema);

/**
 * Нормализованная категория для UI — формируется в коде
 * группировкой `menu_items` по строке `category`.
 */
export const MenuCategoryWithItemsSchema = z.object({
  id: z.string(),
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
    }),
  ),
});

export type MenuCategoryWithItems = z.infer<typeof MenuCategoryWithItemsSchema>;
