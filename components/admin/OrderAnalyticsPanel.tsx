import { formatMoneyRu } from "@/lib/format/money";
import type { OrderAnalytics } from "@/services/orders/getOrderAnalytics";

type OrderAnalyticsPanelProps = {
  currency: string;
  analytics7: OrderAnalytics;
  analytics30: OrderAnalytics;
};

export function OrderAnalyticsPanel({
  currency,
  analytics7,
  analytics30,
}: OrderAnalyticsPanelProps) {
  return (
    <div className="space-y-8">
      <p className="text-sm text-neutral-400">
        Данные за период по вашему ресторану (RLS: только заказы этого tenant).
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <AnalyticsCard
          title="Последние 7 дней"
          currency={currency}
          data={analytics7}
        />
        <AnalyticsCard
          title="Последние 30 дней"
          currency={currency}
          data={analytics30}
        />
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  currency,
  data,
}: {
  title: string;
  currency: string;
  data: OrderAnalytics;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 font-serif text-lg text-white">{title}</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-neutral-500">Заказов</dt>
          <dd className="text-white">{data.orderCount}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-neutral-500">Выручка</dt>
          <dd className="font-medium text-emerald-300">
            {formatMoneyRu(data.revenueTenge, currency)}
          </dd>
        </div>
      </dl>

      <h3 className="mb-2 mt-6 text-xs font-medium uppercase tracking-wider text-neutral-500">
        Топ позиций по выручке
      </h3>
      {data.topItems.length === 0 ? (
        <p className="text-sm text-neutral-600">Нет данных за период.</p>
      ) : (
        <ul className="space-y-2 text-sm">
          {data.topItems.map((row) => (
            <li
              key={row.menuItemId}
              className="flex justify-between gap-2 border-b border-white/5 pb-2 last:border-0"
            >
              <span className="min-w-0 truncate text-neutral-200">
                {row.name}
              </span>
              <span className="shrink-0 text-neutral-400">
                ×{row.quantity} ·{" "}
                <span className="text-[color:var(--primary)]">
                  {formatMoneyRu(row.revenueTenge, currency)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
