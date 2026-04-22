-- Модификаторы меню (см. database_schema.sql): группы, опции, связь M:N с позициями.
-- Плюс метаданные заказа и JSON-снимок модификаторов в строке заказа.

create table if not exists public.modifier_groups (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  min_selection int not null default 0,
  max_selection int not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.modifiers (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.modifier_groups(id) on delete cascade,
  name text not null,
  price numeric(12, 2) not null default 0,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.menu_item_modifiers (
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  modifier_group_id uuid not null references public.modifier_groups(id) on delete cascade,
  primary key (menu_item_id, modifier_group_id)
);

create index if not exists modifier_groups_tenant_idx on public.modifier_groups (tenant_id);
create index if not exists modifiers_group_idx on public.modifiers (group_id);

-- Снимок выбранных модификаторов на строке заказа (имена и цены на момент оформления).
alter table public.order_items
  add column if not exists modifiers jsonb not null default '[]'::jsonb;

alter table public.orders
  add column if not exists comment text;

alter table public.orders
  add column if not exists order_type text not null default 'delivery';

alter table public.modifier_groups enable row level security;
alter table public.modifiers enable row level security;
alter table public.menu_item_modifiers enable row level security;

drop policy if exists "modifier_groups_public_read" on public.modifier_groups;
create policy "modifier_groups_public_read"
on public.modifier_groups
for select
to anon, authenticated
using (true);

drop policy if exists "modifiers_public_read" on public.modifiers;
create policy "modifiers_public_read"
on public.modifiers
for select
to anon, authenticated
using (true);

drop policy if exists "menu_item_modifiers_public_read" on public.menu_item_modifiers;
create policy "menu_item_modifiers_public_read"
on public.menu_item_modifiers
for select
to anon, authenticated
using (true);
