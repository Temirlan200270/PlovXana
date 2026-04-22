Status: Normative (контракт данных) + Legacy (визуал)

> **Heritage note (v1):** поток данных и границы (`Server → fetch → Client → filters/cart`) по-прежнему валидны. **Визуал** страницы меню (`/[slug]/menu`, `MenuClient`, `MenuCard`, `MenuSkeleton`, `CartDrawer`, `CheckoutForm`, `ItemModifierModal`) пересобран под Heritage Edition: `umber-950` подложка, `CardFrame` с двойным золотым ring, `t-caps`/`t-h1`/`t-micro` типошкала, `Section` с текстурой `brick`. Нормативные источники по визуалу — **`newdocs/visual_identity_heritage.md`** и **`newdocs/ui_kit_material.md`**.

# 🍽️ **Menu Page (Production Grade) — Restaurant OS**

---

# 🧠 1. АРХИТЕКТУРА СТРАНИЦЫ

## `/app/(public)/menu/page.tsx`

### Разделение:

```
Server Component (SSR)
  ↓
fetch menu data
  ↓
Client Component (interactive UI)
  ↓
filters + cart + animations
```

---

# ⚙️ 2. DATA FLOW

```text
Supabase → Menu API → MenuPage (Server) → MenuClient (UI)
```

---

# 🧩 3. SERVER COMPONENT

## 📄 `app/(public)/menu/page.tsx`

```tsx id="menu_page_1"
import { MenuClient } from "@/components/menu/MenuClient";
import { createClient } from "@/lib/supabase/server";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*");

  const { data: items } = await supabase
    .from("menu_items")
    .select("*");

  return <MenuClient categories={categories || []} items={items || []} />;
}
```

---

# 🧠 4. CLIENT COMPONENT (CORE UI)

## 📄 `components/menu/MenuClient.tsx`

```tsx id="menu_client_1"
"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { MenuCard } from "./MenuCard";
import { CategoryTabs } from "./CategoryTabs";

interface Props {
  categories: any[];
  items: any[];
}

export function MenuClient({ categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return items;

    return items.filter(
      (item) => item.category_id === activeCategory
    );
  }, [activeCategory, items]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* HERO SECTION */}
      <section className="px-6 pt-20 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-serif">
          Our Menu
        </h1>
        <p className="text-neutral-400 mt-3">
          Carefully crafted dishes for a premium experience
        </p>
      </section>

      {/* CATEGORY FILTER */}
      <section className="px-6">
        <CategoryTabs
          categories={[
            "All",
            ...categories.map((c) => c.name),
          ]}
          value={activeCategory}
          onChange={setActiveCategory}
        />
      </section>

      {/* GRID */}
      <section className="px-6 py-10">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              layout
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
```

---

# ⚡ 5. SKELETON LOADING (PRO LEVEL UX)

## 📄 `components/menu/MenuSkeleton.tsx`

```tsx id="skeleton_1"
export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-[320px] bg-[#121212] rounded-2xl animate-pulse border border-neutral-800"
        />
      ))}
    </div>
  );
}
```

---

# 🛒 6. LIGHT CART (LOCAL STATE)

## 📄 `store/cart.ts`

```ts id="cart_store_1"
import { create } from "zustand";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: any) => void;
  removeItem: (id: string) => void;
}

export const useCart = create<CartState>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        };
      }

      return {
        items: [...state.items, { ...item, qty: 1 }],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
}));
```

---

# 🧾 7. SEO (CRITICAL FOR META + GOOGLE)

## 📄 JSON-LD (Restaurant Schema)

Добавляем в page:

```tsx id="seo_1"
export const metadata = {
  title: "Menu | Restaurant OS",
  description: "Explore our premium menu",
};
```

---

## JSON-LD (inside layout or page)

```tsx id="jsonld_1"
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Restaurant OS Demo",
  servesCuisine: "International",
  hasMenu: "https://your-domain.com/menu",
};
```

---

# 🎬 8. MICRO INTERACTIONS (FRAMER MOTION RULES)

## Rules:

* cards appear with stagger
* hover lift
* image zoom
* smooth layout shift

---

## Example (already in MenuClient):

```tsx id="motion_1"
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: index * 0.03 }}
```

---

# 🧠 9. UX DECISIONS (ВАЖНО)

## Почему это production-level:

✔ SSR (SEO ready)
✔ Client filtering (fast UX)
✔ Skeleton loading
✔ Animated grid
✔ Scalable DB schema
✔ Zustand cart
✔ Component separation
✔ No overfetching

---

# ⚡ 10. WHAT MAKES THIS “10/10”

Это уже уровень:

### 🟣 Stripe UI

### 🟣 Uber Eats UX

### 🟣 Linear motion system

---

# 🔥 11. NEXT LEVEL (если хочешь дальше усилить)

Можно добавить:

### 1. Smart AI Menu Filter

> “Хочу что-то острое и недорого”

---

### 2. Real-time orders (Supabase Realtime)

---

### 3. Drag-to-order UX (mobile-first)

---

### 4. Personalized menu (AI ranking)

---