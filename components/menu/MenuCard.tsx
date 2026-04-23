"use client";

import Image from "next/image";
import { Button } from "@/components/ui/primitives/Button";
import { CardFrame } from "@/components/ui/primitives/CardFrame";
import { PlateIcon } from "@/components/ornaments/PlateIcon";
import { formatMoneyRu } from "@/lib/format/money";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";

export type MenuCardItem = MenuCategoryWithItems["items"][number];

type MenuCardProps = {
  item: MenuCardItem;
  currency: string;
  /** Если задан — кнопка превращается в ссылку «Заказать в Telegram». Иначе — просто заголовок. */
  orderHref: string | null;
};

/**
 * Heritage DishCard для витрины: umber-900 фон, gold ring (CardFrame),
 * subtitle caps из description, ₸-формат, бейдж «Авторское» для is_popular.
 * Заказ оформляется в боте, локальной корзины нет.
 */
export function MenuCard({ item, currency, orderHref }: MenuCardProps) {
  const subtitle = buildIngredientsCaps(item.description);

  return (
    <article className="group transition-all duration-600 ease-heritage hover:-translate-y-0.5 hover:shadow-lift-lg">
      <CardFrame className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none bg-[url('/photo/texture-brick.webp')] bg-repeat opacity-25 mix-blend-overlay"
          aria-hidden
        />

        {item.is_popular ? (
          <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 bg-ember-500 px-4 py-1 shadow-lift-sm">
            <span className="t-micro text-umber-950">Авторское</span>
          </div>
        ) : null}

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <div className="mb-6 h-44 w-44 md:h-56 md:w-56">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={224}
                height={224}
                className="h-full w-full object-cover"
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 30vw, 224px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-umber-950/40 ring-1 ring-gold-500/20">
                <PlateIcon variant="default" className="h-24 w-24 text-gold-500/60" />
              </div>
            )}
          </div>

          <h3 className="t-h3 mb-2">{item.name}</h3>
          {subtitle ? <p className="t-micro mb-4">{subtitle}</p> : null}
          <hr className="mb-4 h-px w-20 border-0 bg-gold-500/40" />
          <p className="font-serif text-2xl text-gold-500">
            {formatMoneyRu(item.price, currency)}
          </p>

          {orderHref ? (
            <div className="mt-6 w-full">
              <Button
                href={orderHref}
                variant="secondary"
                size="sm"
                className="w-full"
                target="_blank"
                rel="noopener noreferrer"
              >
                Заказать в Telegram
              </Button>
            </div>
          ) : null}
        </div>
      </CardFrame>
    </article>
  );
}

/** Описание → caps-строка ингредиентов. Пусто — пусто. */
function buildIngredientsCaps(description: string | null): string {
  const base = (description ?? "").trim();
  if (!base) return "";
  const normalized = base.replace(/\s+/g, " ").slice(0, 60);
  return normalized.toUpperCase();
}
