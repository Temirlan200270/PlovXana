/**
 * Пустая строка, пробелы и плейсхолдеры вроде `https://` без хоста не считаются конфигом.
 * Иначе middleware падает с «Invalid supabaseUrl» при `createServerClient`.
 */
function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Общая проверка env для Supabase (Edge middleware и Node server). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return Boolean(url && key && isValidHttpUrl(url));
}

/** Service role только на сервере — для доверенных записей (гостевой заказ после валидации). */
export function isSupabaseAdminConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const role = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? "";
  return Boolean(url && role && isValidHttpUrl(url));
}
