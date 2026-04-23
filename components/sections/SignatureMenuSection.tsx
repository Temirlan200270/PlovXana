import Link from "next/link";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";
import { Section } from "@/components/ui/primitives/Section";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { DishCard } from "@/components/cards/DishCard";

function pickSignatureItems(menu: MenuCategoryWithItems[]): MenuCategoryWithItems["items"] {
  const all = menu.flatMap((c) => c.items);
  const popular = all.filter((i) => i.is_popular === true);
  const picked = (popular.length >= 3 ? popular : all).slice(0, 3);
  return picked;
}

/**
 * Подзаголовок карточки блюда. Если в БД бота нет описания — возвращаем null,
 * чтобы карточка не показывала фейковые ингредиенты (раньше хардкодилось
 * «БАРАНИНА · АЙВА · ЗИРА», что врало на 100% позиций без состава).
 * Когда поле description появится — рендерим его в верхнем регистре, до 60 симв.
 */
function buildSubtitle(item: { description: string | null }): string | null {
  const base = (item.description ?? "").trim();
  if (!base) return null;
  const normalized = base.replace(/\s+/g, " ").slice(0, 60);
  return normalized.toUpperCase();
}

export function SignatureMenuSection({
  copy,
  menuHref,
  currency,
  menu,
}: {
  copy: TenantPublicConfig;
  menuHref: string;
  currency: string;
  menu: MenuCategoryWithItems[];
}) {
  const items = pickSignatureItems(menu);

  return (
    <Section texture="brick" className="bg-umber-950">
      <div id="menu">
        <div className="t-caps text-center">{copy.signatureEyebrow}</div>
        <h2 className="mt-6 text-center t-h1">
          {copy.signatureTitleLine1} <br />
          <ItalicAccent>{copy.signatureTitleAccent}</ItalicAccent>
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {items.map((item) => (
            <DishCard
              key={item.id}
              name={item.name}
              subtitle={buildSubtitle(item)}
              price={Number(item.price)}
              imageUrl={item.image_url}
              currency={currency}
              featured={item.is_popular === true}
            />
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link
            href={menuHref}
            className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-[0.3em] uppercase text-gold-500 border-t border-gold-500 pt-3 transition-colors duration-600 ease-heritage hover:text-gold-400"
          >
            Смотреть всё меню <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}

