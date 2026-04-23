import { createBrowserClient } from "@supabase/ssr";

/**
 * Клиент Supabase для браузера (anon + сессия из cookie). Не использовать для service_role.
 * Нужен для Realtime и будущих клиентских подписок под RLS.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Supabase browser: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createBrowserClient(url, key);
}
