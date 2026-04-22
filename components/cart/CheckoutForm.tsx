"use client";

import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { useCart } from "@/store/useCart";
import { submitOrderAction } from "@/app/actions/order.actions";
import { Button } from "@/components/ui/primitives/Button";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { formatMoneyRu } from "@/lib/format/money";

export type CheckoutFormProps = {
  onBack: () => void;
  currency: string;
};

/**
 * Heritage CheckoutForm: inputs по §6.1 (umber-900 + ring-gold-500/40, rounded-none),
 * ring-ember-600 для ошибок (без фона ярко-красного), микрокопия по §3.3.
 */
export function CheckoutForm({ onBack, currency }: CheckoutFormProps) {
  const items = useCart((s) => s.items);
  const tenantId = useCart((s) => s.tenantId);
  const totalAmount = useCart((s) => s.totalAmount);
  const clearCart = useCart((s) => s.clearCart);

  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isSuccess) {
    return (
      <div className="relative flex h-full flex-col items-center justify-center overflow-hidden text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(232, 168, 79, 0.35), transparent 70%)",
            opacity: 0.4,
          }}
          aria-hidden
        />
        <h3 className="relative t-h2">
          Заказ принят. <br />
          <ItalicAccent>Казан уже ставим.</ItalicAccent>
        </h3>
        <p className="relative mt-4 t-body text-cream-100/70 max-w-[30ch]">
          Мы перезвоним подтвердить, как только повар примет заказ.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          const result = await submitOrderAction({
            tenant_id: tenantId ?? "",
            customer_name: String(formData.get("name") ?? ""),
            customer_phone: String(formData.get("phone") ?? ""),
            comment: String(formData.get("comment") ?? "").trim() || undefined,
            order_type: "delivery",
            items: items.map((i) => ({
              menu_item_id: i.menu_item_id,
              quantity: i.quantity,
              modifier_ids: i.modifier_ids ?? [],
            })),
          });

          if (!result.success) {
            setError(result.error.message);
            return;
          }

          setIsSuccess(true);
          window.setTimeout(() => clearCart(), 3000);
        });
      }}
      className="space-y-6"
    >
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 t-micro transition-colors duration-600 ease-heritage hover:text-gold-500"
      >
        <ArrowLeft className="h-3 w-3" aria-hidden /> Назад в заказ
      </button>

      <div className="space-y-5">
        <Field label="Имя">
          <Input name="name" placeholder="Как к вам обращаться" required disabled={isPending} />
        </Field>
        <Field label="Телефон">
          <Input
            name="phone"
            placeholder="Куда набрать"
            required
            disabled={isPending}
            inputMode="tel"
          />
        </Field>
        <Field label="Пожелание">
          <Textarea
            name="comment"
            placeholder="Что для вас важно"
            disabled={isPending}
          />
        </Field>
      </div>

      {error ? (
        <div
          className="ring-1 ring-ember-600/60 bg-umber-900/60 px-4 py-3"
          role="status"
        >
          <p className="t-body text-cream-100/85">{error}</p>
        </div>
      ) : null}

      <div className="pt-1">
        <Button
          variant="primary"
          size="md"
          className="w-full"
          type="submit"
          disabled={isPending}
        >
          {isPending
            ? "Передаём на кухню…"
            : `Подтвердить — ${formatMoneyRu(totalAmount(), currency)}`}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="t-micro">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

type InputProps = {
  name: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  inputMode?: "text" | "tel";
};

function Input({ name, placeholder, required, disabled, inputMode }: InputProps) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      inputMode={inputMode}
      className="w-full px-4 py-3 bg-umber-900 text-cream-100 font-sans text-base ring-[0.5px] ring-gold-500/60 shadow-inset-sm placeholder:text-muted-400 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all duration-600 ease-heritage rounded-none disabled:opacity-60"
    />
  );
}

function Textarea({
  name,
  placeholder,
  disabled,
}: {
  name: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <textarea
      name={name}
      placeholder={placeholder}
      rows={4}
      disabled={disabled}
      className="w-full px-4 py-3 bg-umber-900 text-cream-100 font-sans text-base ring-[0.5px] ring-gold-500/60 shadow-inset-sm placeholder:text-muted-400 focus:ring-1 focus:ring-gold-500 focus:outline-none transition-all duration-600 ease-heritage rounded-none resize-none disabled:opacity-60"
    />
  );
}
