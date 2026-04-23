import type { z } from "zod";
import { MenuModifierGroupSchema } from "@/lib/validation/menu";

export type ModifierGroup = z.infer<typeof MenuModifierGroupSchema>;

/** Выбор по группам: groupId → id модификаторов. */
export type SelectionByGroup = Readonly<Record<string, readonly string[]>>;

/**
 * Стабильный id строки корзины: одна позиция + один набор модификаторов = одна линия.
 */
export function buildCartLineId(
  menuItemId: string,
  modifierIds: readonly string[],
): string {
  const sorted = [...modifierIds].sort();
  return sorted.length > 0
    ? `menu:${menuItemId}:${sorted.join(":")}`
    : `menu:${menuItemId}`;
}

/** Собирает все id модификаторов из выбора по группам. */
export function flattenModifierIds(selection: SelectionByGroup): string[] {
  const out: string[] = [];
  for (const ids of Object.values(selection)) {
    out.push(...ids);
  }
  return [...new Set(out)];
}

/**
 * Проверка min/max по группам (зеркало серверной логики submitOrder для UX).
 */
export function validateModifierSelectionByGroup(
  groups: readonly ModifierGroup[],
  selection: SelectionByGroup,
): { ok: true } | { ok: false; message: string } {
  for (const g of groups) {
    const picked = selection[g.id] ?? [];
    const count = picked.length;
    if (count < g.min_selection) {
      return {
        ok: false,
        message: `Выберите минимум ${g.min_selection} в группе «${g.name}».`,
      };
    }
    if (count > g.max_selection) {
      return {
        ok: false,
        message: `В группе «${g.name}» можно выбрать не больше ${g.max_selection}.`,
      };
    }
  }
  return { ok: true };
}

/**
 * Человекочитаемая строка для корзины (клиентский ориентир; цены считает сервер).
 */
export function buildModifierSummary(
  groups: readonly ModifierGroup[],
  selection: SelectionByGroup,
): string {
  const parts: string[] = [];
  const idToName = new Map<string, string>();
  for (const g of groups) {
    for (const m of g.modifiers) {
      idToName.set(m.id, m.name);
    }
  }
  for (const g of groups) {
    for (const mid of selection[g.id] ?? []) {
      const label = idToName.get(mid);
      if (label) parts.push(label);
    }
  }
  return parts.join(", ");
}

/** Сумма наценок выбранных модификаторов (для отображения в UI). */
export function sumModifierExtras(
  groups: readonly ModifierGroup[],
  selection: SelectionByGroup,
): number {
  const idToPrice = new Map<string, number>();
  for (const g of groups) {
    for (const m of g.modifiers) {
      idToPrice.set(m.id, m.price);
    }
  }
  let sum = 0;
  for (const ids of Object.values(selection)) {
    for (const id of ids) {
      sum += idToPrice.get(id) ?? 0;
    }
  }
  return sum;
}
