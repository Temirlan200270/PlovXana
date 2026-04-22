-- Гостевые заказы: INSERT только через доверенный сервер (SUPABASE_SERVICE_ROLE_KEY), не через anon.
-- Персонал: доступ к заказам своего tenant по связи staff.user_id → staff.tenant_id (без кастомных JWT-claims).

drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "order_items_insert_public" on public.order_items;

drop policy if exists "orders_staff_by_tenant" on public.orders;
create policy "orders_staff_by_tenant"
on public.orders
for all
to authenticated
using (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
)
with check (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
);

drop policy if exists "order_items_staff_by_tenant" on public.order_items;
create policy "order_items_staff_by_tenant"
on public.order_items
for all
to authenticated
using (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
)
with check (
  tenant_id in (select s.tenant_id from public.staff s where s.user_id = auth.uid())
);
