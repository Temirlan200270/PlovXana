-- iiko sync: поля для связки внешних UUID и внутренней модели.

alter table public.categories
  add column if not exists iiko_id uuid unique;

alter table public.menu_items
  add column if not exists iiko_id uuid unique;

alter table public.menu_items
  add column if not exists iiko_parent_id uuid;

