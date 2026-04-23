import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseAdminConfigured, isSupabaseConfigured } from "@/lib/supabase/env";

export { isSupabaseAdminConfigured, isSupabaseConfigured };

/**
 * Клиент Supabase для Server Components / Route Handlers / Server Actions.
 * См. blueprint: BFF не отдаёт ключ service_role на клиент.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>,
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            /* set из Server Component может быть запрещён — сессии обновляет middleware при необходимости */
          }
        },
      },
    },
  );
}
