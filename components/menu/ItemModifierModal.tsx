"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/primitives/Button";
import {
  buildCartLineId,
  buildModifierSummary,
  flattenModifierIds,
  sumModifierExtras,
  validateModifierSelectionByGroup,
  type ModifierGroup,
  type SelectionByGroup,
} from "@/lib/domain/modifier-selection";
import { moneyToIntTenge } from "@/lib/domain/order-money";
import { formatMoneyRu } from "@/lib/format/money";
import { cn } from "@/lib/utils/cn";
import type { MenuCategoryWithItems } from "@/lib/validation/menu";
import { useCart } from "@/store/useCart";

/** Позиция меню в карточке (без циклического импорта из MenuCard). */
type MenuItemCard = MenuCategoryWithItems["items"][number];

export type ItemModifierModalProps = {
  open: boolean;
  onClose: () => void;
  item: MenuItemCard;
  currency: string;
  tenantId: string;
};

function emptySelection(groups: readonly ModifierGroup[]): Record<string, string[]> {
  const o: Record<string, string[]> = {};
  for (const g of groups) o[g.id] = [];
  return o;
}

/**
 * Heritage modal выбора модификаторов: umber-950 панель, gold ring,
 * gold accent для +цены, ember-600 для подсказки валидации.
 */
export function ItemModifierModal({
  open,
  onClose,
  item,
  currency,
  tenantId,
}: ItemModifierModalProps) {
  const addItem = useCart((s) => s.addItem);
  const groups = useMemo(
    () => item.modifier_groups ?? [],
    [item.modifier_groups],
  );

  const [byGroup, setByGroup] = useState<Record<string, string[]>>(() =>
    emptySelection(groups),
  );

  useEffect(() => {
    if (open) setByGroup(emptySelection(item.modifier_groups ?? []));
  }, [open, item]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const flatIds = useMemo(
    () => flattenModifierIds(byGroup as SelectionByGroup),
    [byGroup],
  );
  const extras = useMemo(
    () => sumModifierExtras(groups, byGroup as SelectionByGroup),
    [groups, byGroup],
  );
  const unitTotal = moneyToIntTenge(Number(item.price) + extras);
  const validation = useMemo(
    () => validateModifierSelectionByGroup(groups, byGroup as SelectionByGroup),
    [groups, byGroup],
  );

  function setGroupIds(groupId: string, ids: string[]) {
    setByGroup((prev) => ({ ...prev, [groupId]: ids }));
  }

  function selectExclusive(group: ModifierGroup, modId: string | null) {
    if (modId === null) {
      if (group.min_selection >= 1) return;
      setGroupIds(group.id, []);
      return;
    }
    setGroupIds(group.id, [modId]);
  }

  function toggleMulti(group: ModifierGroup, modId: string) {
    const cur = byGroup[group.id] ?? [];
    const has = cur.includes(modId);
    if (has) {
      const next = cur.filter((id) => id !== modId);
      if (next.length < group.min_selection) return;
      setGroupIds(group.id, next);
      return;
    }
    if (cur.length >= group.max_selection) return;
    setGroupIds(group.id, [...cur, modId]);
  }

  function handleAdd() {
    const sel = byGroup as SelectionByGroup;
    const v = validateModifierSelectionByGroup(groups, sel);
    if (!v.ok) return;

    const lineId = buildCartLineId(item.id, flatIds);
    const summary = buildModifierSummary(groups, sel);

    addItem(tenantId, {
      id: lineId,
      menu_item_id: item.id,
      name: item.name,
      price: unitTotal,
      quantity: 1,
      modifier_ids: flatIds,
      modifier_summary: summary.trim() ? summary : undefined,
      image_url: item.image_url ?? undefined,
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            className="absolute inset-0 bg-umber-950/80 backdrop-blur-sm"
            aria-label="Закрыть выбор опций"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-modal-title"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="relative flex max-h-[88vh] w-full max-w-lg flex-col bg-umber-950 ring-1 ring-gold-500/40 shadow-lift-lg"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gold-500/20 px-6 py-5">
              <div className="min-w-0">
                <p className="t-caps">КОМПОЗИЦИЯ</p>
                <h2
                  id="item-modal-title"
                  className="mt-1 font-serif text-2xl text-cream-100"
                >
                  {item.name}
                </h2>
                <p className="mt-2 t-micro">
                  ОТ {formatMoneyRu(item.price, currency).toUpperCase()}
                  {extras > 0
                    ? ` · СЕЙЧАС ${formatMoneyRu(unitTotal, currency).toUpperCase()}`
                    : null}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 text-cream-100/60 transition-colors duration-600 ease-heritage hover:text-gold-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
                aria-label="Закрыть"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {groups.map((group) => {
                const cur = byGroup[group.id] ?? [];
                const isExclusive = group.max_selection === 1;
                const allowSkip = isExclusive && group.min_selection === 0;

                return (
                  <fieldset key={group.id} className="mb-8 last:mb-0">
                    <legend className="mb-3 flex items-baseline gap-3">
                      <span className="font-serif text-base text-cream-100">
                        {group.name}
                      </span>
                      <span className="t-micro">
                        {group.min_selection === group.max_selection
                          ? `НУЖНО ${group.min_selection}`
                          : `ОТ ${group.min_selection} ДО ${group.max_selection}`}
                      </span>
                    </legend>

                    <div className="space-y-2">
                      {allowSkip ? (
                        <OptionRow
                          name={`modifier-group-${group.id}`}
                          type="radio"
                          checked={cur.length === 0}
                          onChange={() => selectExclusive(group, null)}
                          label="Без добавки"
                          extra={null}
                        />
                      ) : null}

                      {group.modifiers.map((m) => {
                        const selected = cur.includes(m.id);
                        return (
                          <OptionRow
                            key={m.id}
                            name={`modifier-group-${group.id}`}
                            type={isExclusive ? "radio" : "checkbox"}
                            checked={selected}
                            onChange={() =>
                              isExclusive
                                ? selectExclusive(group, m.id)
                                : toggleMulti(group, m.id)
                            }
                            label={m.name}
                            extra={
                              m.price > 0
                                ? `+${formatMoneyRu(m.price, currency)}`
                                : null
                            }
                          />
                        );
                      })}
                    </div>
                  </fieldset>
                );
              })}
            </div>

            <div className="border-t border-gold-500/20 bg-umber-900/60 px-6 py-5 shadow-inset-sm">
              {!validation.ok ? (
                <div
                  className="mb-4 ring-1 ring-ember-600/60 bg-umber-950/60 px-4 py-3"
                  role="status"
                >
                  <p className="t-body text-cream-100/85">{validation.message}</p>
                </div>
              ) : null}
              <Button
                type="button"
                variant="primary"
                size="md"
                className="w-full"
                disabled={!validation.ok}
                onClick={handleAdd}
              >
                Добавить — {formatMoneyRu(unitTotal, currency)}
              </Button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function OptionRow({
  name,
  type,
  checked,
  onChange,
  label,
  extra,
}: {
  name: string;
  type: "radio" | "checkbox";
  checked: boolean;
  onChange: () => void;
  label: string;
  extra: string | null;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-none px-4 py-3 transition-colors duration-600 ease-heritage",
        checked
          ? "bg-umber-900 ring-1 ring-gold-500 text-cream-100"
          : "bg-umber-900/40 ring-1 ring-gold-500/20 text-cream-100/80 hover:ring-gold-500/60",
      )}
    >
      <span className="flex items-center gap-3 font-sans text-sm">
        <input
          type={type}
          name={name}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 accent-gold-500"
        />
        {label}
      </span>
      {extra ? (
        <span className="font-serif text-sm text-gold-500">{extra}</span>
      ) : (
        <span className="t-micro">—</span>
      )}
    </label>
  );
}
