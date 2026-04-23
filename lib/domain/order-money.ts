/**
 * Денежные суммы в тенге для заказов: одна формула с сервером (`submitOrder`).
 * Цены позиций и модификаторов в БД — числа; итог строки и заказа — целые тенге.
 */
export function moneyToIntTenge(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value);
}

/** Сумма по строке корзины: округлённая цена за единицу × количество. */
export function lineTotalTenge(unitPrice: number, quantity: number): number {
  return moneyToIntTenge(unitPrice) * quantity;
}
