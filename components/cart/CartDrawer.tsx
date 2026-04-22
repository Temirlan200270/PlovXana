"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import { useCart } from "@/store/useCart";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { lineTotalTenge } from "@/lib/domain/order-money";
import { formatMoneyRu } from "@/lib/format/money";

export type CartDrawerProps = {
  currency: string;
};

/**
 * Heritage CartDrawer: umber-950 панель, gold-rim слева, строки с gold ring.
 * Закрытие по Escape — master-spec §16; framer-motion для drawer-анимации.
 */
export function CartDrawer({ currency }: CartDrawerProps) {
  const isOpen = useCart((s) => s.isOpen);
  const setOpen = useCart((s) => s.setOpen);
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const totalAmount = useCart((s) => s.totalAmount);
  const [view, setView] = useState<"cart" | "checkout">("cart");

  const total = useMemo(() => totalAmount(), [totalAmount]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.button
            type="button"
            aria-label="Закрыть корзину"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-umber-950/80 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="relative flex h-full w-full max-w-md flex-col bg-umber-950 ring-1 ring-gold-500/40 shadow-lift-lg"
          >
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gold-500/60" aria-hidden />

            <div className="flex items-center justify-between border-b border-gold-500/20 px-6 py-5">
              <div>
                <p className="t-caps">{view === "cart" ? "ВАШ ЗАКАЗ" : "ОФОРМЛЕНИЕ"}</p>
                <h2 className="mt-1 font-serif text-xl text-cream-100">
                  {view === "cart" ? "Дастархан" : "Куда подавать"}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-cream-100/60 transition-colors duration-600 ease-heritage hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                aria-label="Закрыть"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {view === "cart" ? (
                items.length > 0 ? (
                  <ul className="space-y-4">
                    {items.map((it) => (
                      <li
                        key={it.id}
                        className="flex items-start gap-4 bg-umber-900 ring-1 ring-gold-500/30 p-4"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-base text-cream-100">{it.name}</h4>
                          {it.modifier_summary ? (
                            <p className="mt-1 line-clamp-2 t-micro">
                              {it.modifier_summary}
                            </p>
                          ) : null}
                          <p className="mt-2 font-serif text-sm text-gold-500">
                            {formatMoneyRu(
                              lineTotalTenge(it.price, it.quantity),
                              currency,
                            )}
                            {it.quantity > 1 ? (
                              <span className="ml-2 t-micro">
                                {formatMoneyRu(it.price, currency)} × {it.quantity}
                              </span>
                            ) : null}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 ring-1 ring-gold-500/30 bg-umber-950/50 px-1">
                          <button
                            type="button"
                            onClick={() => updateQuantity(it.id, -1)}
                            className="p-2 text-cream-100/80 transition-colors duration-600 ease-heritage hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                            aria-label="Уменьшить количество"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="min-w-6 text-center font-sans text-xs text-cream-100">
                            {it.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(it.id, 1)}
                            className="p-2 text-cream-100/80 transition-colors duration-600 ease-heritage hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                            aria-label="Увеличить количество"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(it.id)}
                          className="text-muted-400 transition-colors duration-600 ease-heritage hover:text-ember-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember-500"
                          aria-label="Убрать из заказа"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingCart
                      className="mb-6 h-12 w-12 text-gold-500/40 lamp-breathe"
                      aria-hidden
                    />
                    <p className="t-h3 mb-2">Дастархан пока пуст</p>
                    <p className="t-body text-cream-100/60 max-w-[28ch]">
                      Загляните в меню — повар уже растопил казан.
                    </p>
                  </div>
                )
              ) : (
                <CheckoutForm
                  onBack={() => setView("cart")}
                  currency={currency}
                />
              )}
            </div>

            {items.length > 0 && view === "cart" ? (
              <div className="border-t border-gold-500/20 bg-umber-900/60 px-6 py-5 shadow-inset-sm">
                <div className="mb-5 flex items-baseline justify-between">
                  <span className="t-caps">ИТОГО</span>
                  <span className="font-serif text-2xl text-gold-500">
                    {formatMoneyRu(total, currency)}
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setView("checkout")}
                >
                  Передать на кухню
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
