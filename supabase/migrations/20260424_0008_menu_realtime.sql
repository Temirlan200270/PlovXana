-- Realtime + RLS: стоп-лист позиций меню (staff UPDATE) и подписки на `menu_items`.
-- REPLICA IDENTITY FULL — корректные payload при UPDATE в Realtime.

alter table public.menu_items replica identity full;

-- Идемпотентное добавление в публикацию (повторный запуск не падает).
do $$
begin
  alter publication supabase_realtime add table public.menu_items;
exception
  when duplicate_object then null;
end $$;

alter table public.menu_items enable row level security;

-- Каталог: чтение для anon/authenticated (фильтрация по tenant в приложении).
drop policy if exists "menu_items_public_read" on public.menu_items;
create policy "menu_items_public_read"
on public.menu_items
for select
to anon, authenticated
using (true);

-- Стоп-лист: UPDATE только для staff своего tenant.
drop policy if exists "menu_items_staff_update" on public.menu_items;
create policy "menu_items_staff_update"
on public.menu_items
for update
to authenticated
using (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
)
with check (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
);
