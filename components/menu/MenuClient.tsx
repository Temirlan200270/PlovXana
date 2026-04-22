"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { MenuCard, type MenuCardItem } from "@/components/menu/MenuCard";
import { Button } from "@/components/ui/primitives/Button";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { cn } from "@/lib/utils/cn";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";
import { useCart } from "@/store/useCart";

export type MenuClientProps = {
  initialMenu: MenuCategoryWithItems[];
  tenantId: string;
  tenantName: string;
  tenantSlug?: string;
  currency: string;
  loadError: string | null;
  showDevHint: boolean;
};

export function MenuClient({
  initialMenu,
  tenantId,
  tenantName,
  tenantSlug,
  currency,
  loadError,
  showDevHint,
}: MenuClientProps) {
  const router = useRouter();
  const firstCategoryId = initialMenu[0]?.id ?? "";
  const [activeCategoryId, setActiveCategoryId] = useState(firstCategoryId);

  useEffect(() => {
    if (showDevHint || !tenantId) return;

    const supabase = createSupabaseBrowserClient();
    const channel = supabase
      .channel(`public-menu-items-${tenantId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "menu_items",
          filter: `tenant_id=eq.${tenantId}`,
        },
        () => {
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [tenantId, showDevHint, router]);

  const setOpen = useCart((s) => s.setOpen);
  const totalItems = useCart((s) => s.totalItems);

  const activeItems: MenuCardItem[] = useMemo(() => {
    const cat = initialMenu.find((c) => c.id === activeCategoryId);
    return cat?.items ?? [];
  }, [activeCategoryId, initialMenu]);
  const cartCount = totalItems();
  const tabPanelId = "menu-tabpanel";

  return (
    <div data-tenant-id={tenantId || undefined}>
      {showDevHint ? (
        <div className="mb-8 ring-1 ring-ember-600/40 bg-umber-900/40 px-5 py-4">
          <p className="t-micro mb-2">DEV · ПИЛОТНЫЙ КОНТЕНТ</p>
          <p className="t-body text-cream-100/80">
            Supabase не настроен. tenantId для корзины:{" "}
            <code className="text-cream-100">
              {tenantId || tenantSlug || "—"}
            </code>
          </p>
        </div>
      ) : null}

      {loadError ? (
        <div
          className="mb-8 ring-1 ring-ember-600/60 bg-umber-900/40 p-6 shadow-inset-sm"
          role="alert"
        >
          <div className="flex gap-4">
            <AlertCircle
              className="h-6 w-6 shrink-0 text-ember-500"
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-3">
              <p className="t-h3">Меню сегодня недоступно</p>
              <p className="t-body text-cream-100/80">{loadError}</p>
              <Button
                variant="secondary"
                size="sm"
                className="gap-3"
                onClick={() => router.refresh()}
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                Обновить страницу
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mb-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="t-caps">МЕНЮ</p>
            <h1 className="mt-3 t-h1">
              Кухня <ItalicAccent>{tenantName}</ItalicAccent>
            </h1>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setOpen(true)}
            aria-label="Открыть корзину"
          >
            Корзина{cartCount > 0 ? ` · ${cartCount}` : ""}
          </Button>
        </div>
        <p className="mt-4 t-body text-cream-100/70">
          Свежая подача, актуальные цены — без скрытых наценок.
        </p>
      </div>

      {!loadError && initialMenu.length === 0 ? (
        <div className="ring-1 ring-gold-500/30 bg-umber-900/40 p-8 text-center">
          <p className="t-body text-cream-100/80">
            Меню обновляется. Заходите чуть позже или позвоните, мы расскажем,
            что готовится у казана.
          </p>
        </div>
      ) : null}

      {!loadError && initialMenu.length > 0 ? (
        <>
          <div
            className="mb-10 flex gap-2 overflow-x-auto pb-2"
            role="tablist"
            aria-label="Категории меню"
          >
            {initialMenu.map((cat) => {
              const active = activeCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategoryId(cat.id)}
                  role="tab"
                  id={`tab-${cat.id}`}
                  aria-controls={tabPanelId}
                  aria-selected={active}
                  className={cn(
                    "shrink-0 rounded-none px-5 py-3 font-sans text-[10px] font-medium tracking-[0.3em] uppercase transition-colors duration-600 ease-heritage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500",
                    active
                      ? "bg-gold-500 text-umber-950 shadow-lift-sm"
                      : "bg-transparent text-cream-100/70 ring-1 ring-gold-500/30 hover:text-gold-500 hover:ring-gold-500",
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          <div
            id={tabPanelId}
            role="tabpanel"
            aria-labelledby={`tab-${activeCategoryId}`}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {activeItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                currency={currency}
                tenantId={tenantId || (tenantSlug ?? "plovxana")}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
