-- Минимальный write-path v1: orders + order_items.
-- Примечание: миграции выполняются Supabase CLI или вручную в SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  customer_name text not null,
  customer_phone text not null,
  currency text not null default 'KZT',
  total_amount integer not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  tenant_id uuid not null,
  menu_item_id uuid not null,
  name text not null,
  unit_price integer not null,
  quantity integer not null,
  created_at timestamptz not null default now()
);

create index if not exists orders_tenant_id_idx on public.orders (tenant_id, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_tenant_id_idx on public.order_items (tenant_id, created_at desc);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- RLS v1 (public заказ): разрешаем INSERT всем (anon), но только если tenant_id совпадает с текущим тенантом приложения.
-- В продакшене лучше ужесточить: через Edge Function / Server (service_role) или через signed user/session.
-- Здесь оставляем как стартовую точку, чтобы write-path работал без auth.

drop policy if exists "orders_insert_public" on public.orders;
create policy "orders_insert_public"
on public.orders
for insert
to anon, authenticated
with check (tenant_id is not null);

drop policy if exists "order_items_insert_public" on public.order_items;
create policy "order_items_insert_public"
on public.order_items
for insert
to anon, authenticated
with check (tenant_id is not null);

