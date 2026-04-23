/**
 * Форматирование денег для UI (ru-RU). Инстансы Intl кешируются по ISO-коду валюты,
 * чтобы не вызывать `new Intl.NumberFormat` на каждом рендере.
 */
const formatters = new Map<string, Intl.NumberFormat>();

function resolveCurrencyCode(currency: string): string {
  return currency === "USD" ? "USD" : "KZT";
}

function getFormatter(currency: string): Intl.NumberFormat {
  const code = resolveCurrencyCode(currency);
  let formatter = formatters.get(code);
  if (!formatter) {
    formatter = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 0,
    });
    formatters.set(code, formatter);
  }
  return formatter;
}

export function formatMoneyRu(amount: number, currency: string): string {
  return getFormatter(currency).format(amount);
}
