-- Публичный контент главной (лендинг) на тенанта: JSONB, валидируется в приложении (HomeConfigSchema).
alter table public.tenants
  add column if not exists home_config jsonb;

comment on column public.tenants.home_config is 'Опциональные переопределения блоков лендинга (hero, features, AI demo). Пусто = fallback на пилотный шаблон + данные строки tenants.';
