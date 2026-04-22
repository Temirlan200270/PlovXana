import Image from "next/image";
import { CardFrame } from "@/components/ui/primitives/CardFrame";
import { formatMoneyRu } from "@/lib/format/money";

export type DishCardProps = {
  name: string;
  subtitle: string;
  price: number;
  imageUrl: string | null;
  currency: string;
  featured?: boolean;
};

export function DishCard({
  name,
  subtitle,
  price,
  imageUrl,
  currency,
  featured,
}: DishCardProps) {
  return (
    <article className="transition-all duration-600 ease-heritage hover:-translate-y-0.5 hover:shadow-lift-lg">
      <CardFrame className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none bg-[url('/photo/texture-brick.jpg')] bg-repeat opacity-30 mix-blend-overlay"
          aria-hidden
        />

        {featured ? (
          <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 bg-ember-500 px-4 py-1">
            <span className="t-micro text-umber-950">Авторское</span>
          </div>
        ) : null}

        <div className="relative z-10 flex flex-col items-center p-6 text-center">
          <div className="mb-6 h-56 w-56">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                width={220}
                height={220}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-umber-950/30 ring-1 ring-gold-500/20" />
            )}
          </div>
          <h3 className="t-h3 mb-2">{name}</h3>
          <p className="t-micro mb-4">{subtitle}</p>
          <hr className="mb-4 h-px w-20 border-0 bg-gold-500/40" />
          <p className="font-serif text-2xl text-gold-500">
            {formatMoneyRu(price, currency)}
          </p>
        </div>
      </CardFrame>
    </article>
  );
}

