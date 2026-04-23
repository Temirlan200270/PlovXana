/**
 * Ссылка на поиск по адресу в Яндекс.Картах (удобно для гостей в РФ/КЗ).
 * Не хранит PII — только уже публичную строку адреса из `TenantContacts`.
 */
export function buildYandexMapsSearchUrl(addressLine: string): string {
  const q = encodeURIComponent(addressLine.trim());
  return `https://yandex.ru/maps/?text=${q}`;
}
