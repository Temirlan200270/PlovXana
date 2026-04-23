/**
 * Пустая строка, пробелы и плейсхолдеры вроде `https://` без хоста не считаются конфигом.
 * Без этого Edge middleware падал бы с «Invalid supabaseUrl» при `createClient`.
 */
function isValidHttpUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Проверка env для Supabase (anon-only — сайт ничего не пишет). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
  return Boolean(url && key && isValidHttpUrl(url));
}
