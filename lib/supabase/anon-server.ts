import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Анонимный Supabase-клиент без cookie-сессии.
 * Нужен для кэшируемых публичных запросов (`unstable_cache` несовместим с `cookies()`).
 * Публичное чтение меню идёт в роли `anon` под RLS.
 */
export function createSupabaseAnonServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) {
    throw new Error(
      "Supabase: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
