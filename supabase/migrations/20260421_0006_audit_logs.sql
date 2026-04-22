-- События привилегированных операций (service_role). RLS включён без политик для anon/authenticated — только service_role.
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  action text not null,
  entity text not null default 'order',
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_tenant_created_idx
  on public.audit_logs (tenant_id, created_at desc);

alter table public.audit_logs enable row level security;
