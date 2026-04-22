-- Realtime (KDS): трансляция изменений public.orders для подписчиков с JWT + RLS.
-- REPLICA IDENTITY FULL — для корректных payload при UPDATE/DELETE в Realtime.

alter table public.orders replica identity full;

alter publication supabase_realtime add table public.orders;
