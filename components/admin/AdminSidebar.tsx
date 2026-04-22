import Link from "next/link";
import { signOutAction } from "@/app/actions/auth.actions";
import type { StaffRole } from "@/lib/validation/staff";

const nav = [
  { href: "/admin/dashboard", label: "Дашборд" },
  { href: "/admin/live-orders", label: "Заказы live" },
  { href: "/admin/menu-editor", label: "Меню" },
] as const;

export function AdminSidebar({
  role,
  tenantLabel,
}: {
  role: StaffRole;
  tenantLabel: string;
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/10 bg-[#0A0A0A]">
      <div className="border-b border-white/10 p-4">
        <p className="text-xs uppercase tracking-wide text-neutral-500">
          Ресторан
        </p>
        <p className="truncate font-medium text-white">{tenantLabel}</p>
        <p className="mt-1 text-xs text-neutral-400">Роль: {role}</p>
      </div>
      <nav className="flex-1 space-y-1 p-2" aria-label="Разделы админки">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-lg px-3 py-2 text-sm text-neutral-300 hover:bg-white/5 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4">
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
          >
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
