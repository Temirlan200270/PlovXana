Status: Normative

# 🛡️ **Zod Schemas: Enterprise SaaS Architecture**

**Канон в репозитории (источник правды для CI и релиза):**

- `lib/validation/primitives.ts` — `IdSchema`, `PhoneSchema` (E.164 + `.trim()`), `TenantSlugSchema`, regex-константы
- `lib/validation/menu.ts` — строки БД и DTO меню (`TenantRowSchema`, `MenuModifierGroupSchema`, …)
- `lib/validation/order.ts` — черновики заказа и `CheckoutDraftSchema`
- `lib/validation/schemas.ts` — `TenantResponseSchema` (merge с `TenantRowSchema` + timestamps)

Фрагменты ниже остаются **нормативным описанием контракта**; при расхождении с кодом приоритет у файлов выше.

**Version:** 2.0 (Production / Multi-tenant)

---

## 🧱 1. BASE PRIMITIVES (Core Layer)

```typescript
import { z } from "zod";

export const IdSchema = z.string().uuid();

export const TimestampSchema = z.object({
  created_at: z.string().datetime().or(z.date()),
  updated_at: z.string().datetime().or(z.date()).optional(),
});

export const PriceSchema = z.coerce
  .number()
  .positive("Price must be greater than 0")
  .finite()
  .safe();

export const PhoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid E.164 phone format");

export const TenantContext = z.object({
  tenant_id: IdSchema,
});
```

---

## 🏢 2. TENANT DOMAIN (Branding & Config)

```typescript
const TenantBase = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  contact_email: z.string().email(),
  contact_phone: PhoneSchema,
  address: z.string().max(255).optional(),
});

export const CreateTenantSchema = TenantBase;
export const UpdateTenantSchema = TenantBase.partial();

export const TenantResponseSchema = z.object({
  id: IdSchema,
  name: z.string().min(2).max(100),
  slug: TenantSlugSchema,
  contact_email: z.string().email().nullable().optional(),
  contact_phone: PhoneSchema.nullable().optional(),
  address: z.string().max(255).nullable().optional(),
  is_active: z.boolean(),
  theme: z.object({
    id: z.string().default("system-dark"),
    colors: z.object({
      primary: z.string().optional(),
      background: z.string().optional(),
      text: z.string().optional(),
    }).partial().optional(),
    ornament: z.object({
      patternUrl: z.string().optional(),
      opacity: z.number().min(0).max(1).optional(),
    }).partial().optional(),
  }).nullable().optional(),
}).merge(TimestampSchema.partial());

/**
 * 💡 NOTE: In implementation, we distinguish between:
 * - RowSchema: Exact mapping of DB columns (nullable, snake_case).
 * - ResponseSchema: Clean DTO for the UI (camelCase, defaults).
 */
```

---

## 🍽️ 3. MENU DOMAIN (Modifiers & Items)

```typescript
// --- Modifiers ---
export const ModifierSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
});

export const ModifierGroupSchema = TenantContext.extend({
  name: z.string().min(1),
  min_selection: z.number().int().min(0).default(0),
  max_selection: z.number().int().min(1).default(1),
  modifiers: z.array(ModifierSchema).min(1),
});

// --- Categories ---
export const CategorySchema = TenantContext.extend({
  name: z.string().min(1),
  sort_order: z.number().int().default(0),
});

// --- Menu Items ---
const MenuItemBase = z.object({
  category_id: IdSchema,
  name: z.string().min(2),
  description: z.string().max(500).optional(),
  price: PriceSchema,
  image_url: z.string().url().optional(),
  is_available: z.boolean().default(true),
  is_popular: z.boolean().default(false),
  attributes: z.object({
    spicy_level: z.number().min(0).max(3).default(0),
    is_vegan: z.boolean().default(false),
    calories: z.number().optional(),
    allergens: z.array(z.string()).default([]),
  }).optional(),
});

export const CreateMenuItemSchema = TenantContext.merge(MenuItemBase);
export const UpdateMenuItemSchema = MenuItemBase.partial();
export const MenuItemResponseSchema = CreateMenuItemSchema.extend({
  id: IdSchema,
}).merge(TimestampSchema);
```

---

## 📦 4. ORDER DOMAIN (Transactions)

```typescript
export const OrderItemSchema = z.object({
  menu_item_id: IdSchema,
  quantity: z.number().int().min(1),
  unit_price: PriceSchema, // Snapshotted price
  selected_modifiers: z.array(z.object({
    name: z.string(),
    price: z.number()
  })).default([]),
});

const OrderBase = z.object({
  status: z.enum(['pending', 'confirmed', 'cooking', 'ready', 'completed', 'cancelled']),
  type: z.enum(['dine_in', 'takeaway', 'delivery']),
  table_number: z.string().optional(),
  customer_name: z.string().min(2),
  customer_phone: PhoneSchema,
  total_amount: PriceSchema,
  comment: z.string().max(300).optional(),
});

export const CreateOrderSchema = TenantContext.extend({
  items: z.array(OrderItemSchema).min(1),
}).merge(OrderBase.omit({ status: true }));

export const OrderResponseSchema = OrderBase.extend({
  id: IdSchema,
  tenant_id: IdSchema,
  items: z.array(OrderItemSchema),
}).merge(TimestampSchema);
```

---

## 🔐 5. STAFF DOMAIN (RBAC)

```typescript
export const StaffRoleSchema = z.enum(['owner', 'admin', 'manager', 'chef', 'waiter']);

export const StaffSchema = TenantContext.extend({
  user_id: IdSchema,
  role: StaffRoleSchema,
  full_name: z.string().min(2),
  is_active: z.boolean().default(true),
});

export const StaffLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## 🧠 6. TYPES INFERENCE

```typescript
export type Tenant = z.infer<typeof TenantResponseSchema>;
export type MenuItem = z.infer<typeof MenuItemResponseSchema>;
export type Order = z.infer<typeof OrderResponseSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type StaffRole = z.infer<typeof StaffRoleSchema>;
```

---

## 🛠️ 7. UTILS: SERVER ACTION VALIDATOR

```typescript
export async function validateAction<T>(schema: z.Schema<T>, data: unknown) {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      code: "VALIDATION_ERROR" as const,
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
```

---

## 🏁 DESIGN COMPLIANCE
- **Layering:** Base -> Domain -> Input/Output
- **Multi-tenancy:** Every input requires `tenant_id`
- **Security:** RLS compatible UUIDs and strict types
- **UX:** Clear error messages and snapshotted prices for orders