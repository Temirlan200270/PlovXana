import { create } from "zustand";
import { persist } from "zustand/middleware";
import { lineTotalTenge } from "@/lib/domain/order-money";
import type { OrderItemDraft } from "@/lib/validation/order";

export type CartItem = OrderItemDraft & {
  /** Уникальный id для UI (в будущем: modifiers → разные строки). */
  id: string;
  /** Для UI-отображения (сервер игнорирует и пересчитывает цены). */
  name: string;
  /** Для UI-отображения (сервер игнорирует и пересчитывает цены). */
  price: number;
  image_url?: string;
  /** Выбранные модификаторы (сервер пересчитывает цены по БД). */
  modifier_ids?: string[];
  /** Краткое описание опций для корзины (только отображение). */
  modifier_summary?: string;
};

type CartState = {
  tenantId: string | null;
  items: CartItem[];
  isOpen: boolean;

  setOpen: (isOpen: boolean) => void;
  addItem: (tenantId: string, item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;

  totalAmount: () => number;
  totalItems: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      tenantId: null,
      items: [],
      isOpen: false,

      setOpen: (isOpen) => set({ isOpen }),

      addItem: (newTenantId, item) =>
        set((state) => {
          const isNewTenant =
            state.tenantId !== null && state.tenantId !== newTenantId;
          const currentItems = isNewTenant ? [] : state.items;

          const existing = currentItems.find((i) => i.id === item.id);
          if (existing) {
            return {
              tenantId: newTenantId,
              items: currentItems.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
              isOpen: true,
            };
          }

          return {
            tenantId: newTenantId,
            items: [...currentItems, item],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, delta) =>
        set((state) => ({
          items: state.items.map((i) => {
            if (i.id !== id) return i;
            const newQuantity = Math.max(1, i.quantity + delta);
            return { ...i, quantity: newQuantity };
          }),
        })),

      clearCart: () => set({ items: [], tenantId: null, isOpen: false }),

      totalAmount: () =>
        get().items.reduce(
          (sum, item) => sum + lineTotalTenge(item.price, item.quantity),
          0,
        ),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: "restaurant-os-cart",
      partialize: (state) => ({ tenantId: state.tenantId, items: state.items }),
    },
  ),
);

