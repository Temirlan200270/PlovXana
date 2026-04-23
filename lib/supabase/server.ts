import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Сайт работает в read-only режиме без сессий и cookies — все клиенты теперь анонимные.
 * Реэкспорт оставлен для совместимости с прежними импортами.
 */
export { isSupabaseConfigured };
