"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toggleMenuItemAvailability } from "@/app/actions/menu.actions";
import { Button } from "@/components/ui/Button";

export type MenuKillSwitchRow = {
  id: string;
  name: string;
  is_available: boolean;
};

type MenuKillSwitchListProps = {
  items: MenuKillSwitchRow[];
};

export function MenuKillSwitchList({ items }: MenuKillSwitchListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <ul className="divide-y divide-white/10 rounded-xl border border-white/10">
      {items.map((row) => (
        <li
          key={row.id}
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
        >
          <span className="min-w-0 flex-1 text-sm text-neutral-200">
            {row.name}
          </span>
          <span className="text-xs text-neutral-500">
            {row.is_available ? "в продаже" : "стоп"}
          </span>
          <Button
            type="button"
            size="sm"
            variant={row.is_available ? "outline" : "primary"}
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await toggleMenuItemAvailability({
                  itemId: row.id,
                  isAvailable: !row.is_available,
                });
                if (result.success) {
                  router.refresh();
                }
              });
            }}
          >
            {row.is_available ? "Стоп" : "Вернуть"}
          </Button>
        </li>
      ))}
    </ul>
  );
}
