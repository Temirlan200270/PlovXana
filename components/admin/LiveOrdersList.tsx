"use client";

import { useLiveOrders, useNewOrderChime } from "@/lib/hooks/useLiveOrders";
import { formatMoneyRu } from "@/lib/format/money";
import type { LiveOrderRow } from "@/lib/validation/liveOrder";

type LiveOrdersListProps = Readonly<{
  tenantId: string;
  initialOrders: readonly LiveOrderRow[];
}>;

export function LiveOrdersList({ tenantId, initialOrders }: LiveOrdersListProps) {
  const { orders, status } = useLiveOrders(tenantId, initialOrders);
  useNewOrderChime(
    orders,
    initialOrders.map((o) => o.id),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-2xl text-white">Заказы live (KDS)</h1>
        <p className="text-xs text-neutral-500" aria-live="polite">
          Realtime:{" "}
          {status === "subscribed"
            ? "подключено"
            : status === "error"
              ? "ошибка канала"
              : "подключение…"}
        </p>
      </div>
      <p className="text-sm text-neutral-400">
        Новые заказы появляются без перезагрузки; при появлении нового заказа звучит сигнал (если браузер
        разрешил звук).
      </p>

      {orders.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 px-4 py-8 text-center text-sm text-neutral-400">
          Пока нет заказов. Оформите тестовый заказ с сайта — он появится здесь.
        </p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-white/10 bg-[#111] p-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs uppercase tracking-wide text-[color:var(--primary)]">
                  {order.status}
                </span>
                <span className="text-xs text-neutral-500">
                  {formatTime(order.created_at)}
                </span>
              </div>
              <p className="mt-2 font-medium text-white">{order.customer_name}</p>
              <p className="text-sm text-neutral-400">{order.customer_phone}</p>
              <p className="mt-3 text-lg font-semibold text-white">
                {formatMoneyRu(order.total_amount, order.currency)}
              </p>
              {order.order_type ? (
                <p className="mt-1 text-xs text-neutral-500">Тип: {order.order_type}</p>
              ) : null}
              {order.comment ? (
                <p className="mt-2 border-t border-white/10 pt-2 text-sm text-neutral-300">
                  {order.comment}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatTime(iso: string): string {
  const d = Date.parse(iso);
  if (!Number.isFinite(d)) return iso;
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(d));
}
