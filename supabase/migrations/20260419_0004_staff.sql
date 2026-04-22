-- Персонал ресторана (B2B): связь auth.users ↔ tenant + роль для RBAC.

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now(),
  unique (user_id),
  constraint staff_role_check check (
    role in ('owner', 'manager', 'chef')
  )
);

create index if not exists staff_user_id_idx on public.staff (user_id);
create index if not exists staff_tenant_id_idx on public.staff (tenant_id);

alter table public.staff enable row level security;

-- Чтение только своей строки (серверные проверки для админки — поверх этого).
drop policy if exists "staff_select_own" on public.staff;
create policy "staff_select_own"
on public.staff
for select
to authenticated
using (user_id = auth.uid());

-- INSERT/UPDATE/DELETE: только service_role или будущие политики приглашений.
-- Bootstrap первого сотрудника — через SQL Editor / service role.
