# Фото для сайта (`/photo/…`)

В Next.js браузер видит только файлы из папки **`public`**. Исходники можно держать в **`photo/` в корне репозитория**, но **рабочие копии с понятными именами** — здесь, в **`public/photo/`**.

### Текущий набор (см. `config/atmosphere.ts` + `newdocs/atmosphere_config.md §2.1`)

Heritage Edition не использует глобальный `AtmosphereStack` — каждая секция сама подтягивает свой `bokeh`/`texture` через `components/ui/primitives/Section.tsx` и конфиг по ключу секции (`hero` / `about` / `menu` / `gallery` / `reserve` / `footer`).

| Файл | Назначение |
|------|------------|
| `hero-dombra.jpg` | `bokeh` для Hero (парень с домброй, глубокий blur + vignette) |
| `texture-brick.jpg` | Текстура секций About / SignatureMenu / Footer (кирпич «ёлочкой») |
| `texture-ikat.jpg` | Текстура Hero (потолок-икат, `mix-blend-overlay`) |
| `atmosphere-warm.jpg` | Резерв для `bokeh` в Gallery / Reserve (тёплый зал) |

Оригиналы с длинными именами (`photo_541564761544714339*_y.jpg`) можно оставить в корневой `photo/` как архив или удалить после проверки.

### Перенос новых снимков (PowerShell, из корня проекта)

```powershell
New-Item -ItemType Directory -Force -Path "public\photo" | Out-Null
Copy-Item -Path "photo\*" -Destination "public\photo\" -Force -ErrorAction SilentlyContinue
```

Переименуйте файлы под таблицу или поправьте пути в `config/atmosphere.ts`.
