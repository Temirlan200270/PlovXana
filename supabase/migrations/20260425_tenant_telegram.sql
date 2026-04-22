-- Уведомления в Telegram: chat_id на тенанта (опционально; иначе fallback через env на сервере).
alter table public.tenants
  add column if not exists telegram_chat_id text;

comment on column public.tenants.telegram_chat_id is 'Telegram chat_id для бота уведомлений о заказах; пусто = использовать TELEGRAM_CHAT_ID в env при необходимости.';
