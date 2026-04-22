# Чеклист перед сдачей изменения

Status: Operational  
Purpose: ручная проверка перед коммитом, релизом или мерджем — пока без обязательного Git можно пройти пункты перед «считаю готово».

Связано с: [documentation-map.md](documentation-map.md), [CODEBASE.md](CODEBASE.md), [compliance-checklist.md](compliance-checklist.md).

---

### Что сделано

- [ ] Кратко: фича / фикс / рефакторинг (что именно).

### Архитектура и безопасность

- [ ] Соответствие [master-spec.md](master-spec.md) и при необходимости [security-spec.md](security-spec.md).
- [ ] Изоляция тенантов и RLS: `service_role` / `lib/supabase/admin.ts` только по утверждённому паттерну (серверная валидация, без утечки ключа на клиент). Стоп-лист меню — отдельный паттерн (сессия staff + RLS), см. [security-spec.md](security-spec.md) §5.1.

### Проверки

- [ ] `npm run typecheck` без ошибок.
- [ ] `npm run lint` без ошибок.
- [ ] При затронутых публичных маршрутах: `npm run test:smoke` (после `build`, как в [testing-strategy.md](testing-strategy.md)).
- [ ] Перед прод-релизом: при необходимости `SMOKE_REQUIRE_SERVICE_ROLE=1` и заданный `SUPABASE_SERVICE_ROLE_KEY` (см. [deployment-runbook.md](deployment-runbook.md)).

### Документация (если применимо)

- [ ] Обновлён [CODEBASE.md](CODEBASE.md), если добавлены или удалены значимые файлы/каталоги.
- [ ] Обновлён [compliance-checklist.md](compliance-checklist.md), если изменился статус требования по спекам.
