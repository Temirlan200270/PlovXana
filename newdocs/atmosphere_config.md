# Atmosphere Config — Heritage Edition

> Техническая спецификация фоновой живости. Где какой ассет лежит, какие CSS-фильтры применяются, как визуал реагирует на события. Без этого документа реализация скатывается в «чёрный фон + золотой акцент» и теряет воздух.
> Зависит от `visual_identity_heritage.md` (слои) и `ui_kit_material.md` (компоненты).

---

## 1. Asset Map — где что лежит

### 1.1. Структура директорий

```
/public/
├── textures/            ← повторяющиеся паттерны (tile)
│   ├── brick-herringbone.png    (800×800, PNG-24, 38KB)
│   ├── ikat-pattern.png         (600×600, PNG-24, 24KB)
│   ├── wood-grain.png           (1024×1024, PNG-24, 52KB)
│   └── pergament-grain.png      (512×512, PNG-24, 18KB)
│
├── photos/              ← реальные фото для bokeh и галереи
│   ├── hero/
│   │   ├── hero-main.jpg        (1920×1080, optimized)
│   │   ├── hero-bokeh.jpg       (1280×720, blurred version)
│   │   └── hero-mobile.jpg      (828×1792)
│   ├── about/
│   │   ├── dombra-player.jpg    (1200×1600, portrait)
│   │   └── hands-dough.jpg      (1200×1200)
│   ├── gallery/
│   │   ├── main-hall.jpg
│   │   ├── ceramic-closeup.jpg
│   │   ├── musician.jpg
│   │   └── tandoor-fire.jpg
│   └── dishes/
│       ├── plov-nomad.webp      (800×800)
│       ├── kazy-premium.webp
│       └── samsa-tandoor.webp
│
├── ornaments/           ← SVG-символы орнаментов
│   ├── kazakh-main.svg
│   ├── plate-plov.svg
│   ├── plate-kazy.svg
│   └── dombra-silhouette.svg
│
└── icons/               ← функциональная иконография (не декор)
    ├── arrow-right.svg
    ├── close.svg
    └── language.svg
```

### 1.2. Обязательное правило по форматам

| Тип ассета | Формат | Почему |
|---|---|---|
| Фото еды | `.webp` | Compression + прозрачность, если нужно |
| Фото атмосферы (зал, люди) | `.jpg` (quality 82) | Плавные градиенты, webp-артефактов меньше |
| Текстуры (tile) | `.png` | Нужен tile-overlay без сжатия |
| Орнамент | `.svg` | Масштабирование + filter-эффекты |
| Логотип, иконки | `.svg` | То же |

Next.js `<Image />` — обязательно для фото. Для текстур — `background-image`, не `<Image />` (плохо тайлится).

### 1.3. Asset → Section mapping

| Секция | Главное фото | Bokeh-слой | Текстура | Декор |
|---|---|---|---|---|
| Hero | `hero/hero-main.jpg` | `hero/hero-bokeh.jpg` | `ikat-pattern.png` | Floating plates SVG, lamp glows |
| О нас | `about/dombra-player.jpg` (crisp) | — | `brick-herringbone.png` | Ornament corners on photo frame |
| Меню | Dish images на карточках | — | `brick-herringbone.png` (на карточках) | — |
| Галерея | 4× `gallery/*.jpg` (tiles) | `gallery/main-hall.jpg` (backdrop) | `brick-herringbone.png` + `ikat-pattern.png` mix | — |
| Бронирование | — | `about/hands-dough.jpg` | `pergament-grain.png` | — |
| Футер | — | — | `brick-herringbone.png` (100% текстура) | Ornament sprite row |

---

## 2. Blur & Opacity Config

Все значения — константы. Не «на глаз», не в компонентах. Вынесены в один конфиг.

### 2.1. TypeScript-конфиг

```ts
// config/atmosphere.ts
export const atmosphere = {
  hero: {
    bokeh:        { blur: 40, opacity: 0.45, overlayAlpha: 0.55 },
    textureIkat:  { opacity: 0.35, blendMode: 'overlay' as const },
    grain:        { opacity: 0.05 },
    lamps:        { glowOpacity: 0.25, glowBlur: 60 },
  },
  about: {
    photoCrisp:   { blur: 0, opacity: 1.0, overlayAlpha: 0 },  // фото резкое
    textureBrick: { opacity: 0.30, blendMode: 'overlay' as const },
    grain:        { opacity: 0.04 },
    frameRing:    { outerOpacity: 1.0, innerOpacity: 0.4 },
  },
  menu: {
    textureBrick: { opacity: 0.25, blendMode: 'overlay' as const },  // на карточках
    grain:        { opacity: 0.04 },
    dishImage:    { idle: { opacity: 1.0 }, soldOut: { opacity: 0.55, saturate: 0.4 } },
  },
  gallery: {
    bokeh:        { blur: 30, opacity: 0.35, overlayAlpha: 0.70 },  // сильнее тёмный оверлей
    textureBrick: { opacity: 0.40, blendMode: 'overlay' as const },
    textureIkat:  { opacity: 0.25, blendMode: 'soft-light' as const },
    grain:        { opacity: 0.05 },
    tileImage:    { idle: { opacity: 0.70 }, hover: { opacity: 0.90 } },
  },
  reserve: {
    bokeh:        { blur: 50, opacity: 0.30, overlayAlpha: 0.60 },
    grain:        { opacity: 0.05 },
  },
  footer: {
    textureBrick: { opacity: 0.60, blendMode: 'normal' as const },  // максимум текстуры
    grain:        { opacity: 0.06 },
  },
} as const;
```

### 2.2. Правило выбора значений

Диапазоны, за которые выходить запрещено:

| Параметр | Минимум | Максимум | Комментарий |
|---|---|---|---|
| `bokeh.blur` | 20px | 60px | меньше — видно фото; больше — грязь |
| `bokeh.opacity` | 0.25 | 0.55 | поверх ещё тёмный оверлей |
| `overlayAlpha` | 0.50 | 0.75 | сколько тёмного поверх фото |
| `texture.opacity` | 0.20 | 0.60 | меньше — не видно; больше — забор |
| `grain.opacity` | 0.04 | 0.06 | видно — плохо, не видно — ну и ладно |
| `backdrop-blur` (Tailwind) | `blur-md` | `blur-2xl` | только для sticky-шапки |

### 2.3. Как применять в коде

```tsx
// components/sections/HeroSection.tsx
import { atmosphere } from '@/config/atmosphere';

export function HeroSection() {
  const a = atmosphere.hero;
  return (
    <section className="relative min-h-[820px] overflow-hidden">
      {/* Layer 1: bokeh photo */}
      <div className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: "url('/photos/hero/hero-bokeh.jpg')" }} />
      <div className="absolute inset-0"
           style={{ backdropFilter: `blur(${a.bokeh.blur}px)`, background: `rgba(26, 14, 8, ${a.bokeh.overlayAlpha})` }} />

      {/* Layer 2: ikat texture */}
      <div className="absolute inset-0 bg-[url('/textures/ikat-pattern.png')] bg-repeat"
           style={{ opacity: a.textureIkat.opacity, mixBlendMode: a.textureIkat.blendMode }} />

      {/* Layer 3: pergament grain */}
      <div className="absolute inset-0 bg-[url('/textures/pergament-grain.png')] bg-repeat pointer-events-none"
           style={{ opacity: a.grain.opacity }} />

      {/* Layer 4: lamp glows */}
      <LampGlow x="180" y="260" />
      <LampGlow x="1100" y="220" />

      {/* Layer 5: content */}
      <div className="relative z-10">{/* ... */}</div>
    </section>
  );
}
```

### 2.4. Мобильная адаптация

На мобильных (viewport < 768px) **уменьшаем** текстуру и blur на 30%:

```ts
// utils/atmosphere.ts
export function scaleForMobile<T>(config: T, factor = 0.7): T {
  // простой helper: blur и opacity снижаем, чтобы не жрать fps на мобильных
  if (typeof config === 'object' && config !== null) {
    return Object.fromEntries(
      Object.entries(config as object).map(([k, v]) => [
        k,
        k === 'blur' ? Math.round(v * factor) :
        k === 'opacity' ? +(v * factor).toFixed(2) :
        v
      ])
    ) as T;
  }
  return config;
}
```

---

## 3. Performance — что делать, чтобы не тормозило

Несколько слоёв текстур и blur могут убить FPS. Правила:

### 3.1. `will-change` только на анимируемые слои

Никогда не вешайте `will-change: transform` или `will-change: opacity` на статичные декоративные слои. Только на плавающие тарелки и hover-элементы.

### 3.2. `backdrop-filter` — дорогое удовольствие

Используем **один** `backdrop-filter: blur()` на секцию, максимум. Если нужен blur плюс текстура — blur идёт нижним слоем, текстура — поверх.

### 3.3. Текстуры как `background-image` + `bg-repeat`

Не делайте `<div>` размером со всю секцию с текстурным фоном. Используйте repeating pattern на уже существующем элементе через Tailwind.

### 3.4. Lazy-load фото секций ниже fold

```tsx
<Image
  src="/photos/gallery/main-hall.jpg"
  alt="Основной зал"
  loading="lazy"      // обязательно для всего кроме Hero
  placeholder="blur"
  blurDataURL={mainHallBlurData}
/>
```

### 3.5. Target budget

| Метрика | Порог |
|---|---|
| LCP (Hero) | < 2.5s на 4G |
| CLS | < 0.05 |
| Total page weight (above fold) | < 500KB |
| Number of textures loaded | ≤ 3 одновременно |

---

## 4. Floating Elements — плавающие тарелки и ламп-глоу

### 4.1. Параллакс-тарелки

Логика: 3 SVG-тарелки плавно смещаются с скроллом. Интенсивность — максимум 30% (см. `visual_identity_heritage.md §7`).

```tsx
// components/atmosphere/FloatingPlates.tsx
'use client';
import { useScroll, useTransform, motion } from 'framer-motion';

export function FloatingPlates() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, -120]);
  const y2 = useTransform(scrollY, [0, 800], [0, -80]);
  const y3 = useTransform(scrollY, [0, 800], [0, -200]);

  return (
    <>
      <motion.div style={{ y: y1 }} className="absolute left-8 top-[680px] rotate-[-15deg] w-36 h-36 pointer-events-none">
        <PlateIcon variant="plov" size={140} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute right-10 top-[620px] rotate-[22deg] w-32 h-32 pointer-events-none opacity-85">
        <PlateIcon variant="kazy" size={120} />
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute left-16 top-[420px] rotate-[8deg] w-20 h-20 pointer-events-none opacity-70">
        <PlateIcon variant="samsa" size={80} />
      </motion.div>
    </>
  );
}
```

**Правило:** `prefers-reduced-motion: reduce` → параллакс отключается (Framer Motion умеет автоматически).

### 4.2. Lamp glow

Тёплая точка света, эмулирующая медную лампу.

```tsx
export function LampGlow({ x, y, size = 60 }: { x: string; y: string; size?: number }) {
  return (
    <div className="absolute pointer-events-none" style={{ left: x, top: y }}>
      <div
        className="rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          background: 'radial-gradient(circle, rgba(232,168,79,0.25) 0%, rgba(232,168,79,0) 70%)',
          filter: 'blur(20px)',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size / 1.5,
          height: size / 1.5,
          background: 'radial-gradient(circle, rgba(232,168,79,0.5) 0%, rgba(232,168,79,0) 80%)',
        }}
      />
    </div>
  );
}
```

Лампа **дышит** — лёгкое изменение opacity каждые 4–6 сек, десинхронизировано между лампами (если их несколько):

```tsx
<motion.div
  animate={{ opacity: [0.22, 0.28, 0.22] }}
  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 3 }}
>
```

---

## 5. Real-time States — реакция визуала на события

Это место, где дизайн перестаёт быть статичным и становится **живым**. Каждое изменение в backend-состоянии отражается в визуале атмосферно, не технически.

### 5.1. Dish: sold out (казан опустел до вечера)

Событие: блюдо снято со стоп-листа на кухне.

Визуальная реакция карточки:

```tsx
// DishCard в состоянии sold-out:
<article className="relative bg-umber-900 shadow-lift-md opacity-60 grayscale-[0.3] pointer-events-none">
  {/* всё содержимое остаётся, но: */}
  <div className="absolute inset-0 bg-umber-950/40" />

  {/* треснутая тарелка — overlay поверх фото */}
  <svg className="absolute inset-0" viewBox="0 0 360 520">
    <path d="M60 200 Q120 180 180 240 Q240 280 300 260" stroke="#1A0E08" strokeWidth="1.5" fill="none" opacity="0.6" />
  </svg>

  {/* бейдж */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-6deg]">
    <div className="bg-umber-950/90 ring-1 ring-gold-500/50 px-6 py-2">
      <span className="t-caps text-cream-100">Казан опустел</span>
      <span className="block t-micro text-muted-400 mt-1">до вечера</span>
    </div>
  </div>
</article>
```

Трещина на тарелке — не CSS, а SVG-path, добавляемый поверх карточки. Угол, длина и изгиб варьируются (3 заранее заготовленных варианта), чтобы не было одинаково.

### 5.2. Reservation: слот недоступен

Событие: пользователь выбрал время, которого нет.

Визуал: поле «Время» окрашивается `ring-ember-600` (не красным! тёмная терракота), появляется микрокопия из `copy_strategy_nomad.md §3.3`:

```
Этот день у нас закрыт — попробуйте выбрать другой вечер.
```

**Нельзя:** красный `border`, восклицательные знаки, иконка ошибки.

### 5.3. Live: ресторан открыт / закрыт

В футере рядом с «Ежедневно · 12:00 — 24:00» — живой индикатор состояния.

```tsx
function OpenIndicator() {
  const isOpen = useIsOpen(); // хук, проверяющий время
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-ember-500' : 'bg-muted-600'}`}
        style={{ boxShadow: isOpen ? '0 0 8px #D66A3A' : 'none' }}
      />
      <span className="t-micro">{isOpen ? 'Казан горит' : 'До завтра'}</span>
    </span>
  );
}
```

Точка не мигает — это UI из мобильных приложений. Она **тлеет**: та же дыхательная анимация, что у ламп (`§4.2`).

### 5.4. Loading: форма бронирования отправляется

Не спиннер. Не прогресс-бар. **Мерцание лампы.**

```tsx
{isSubmitting && (
  <div className="absolute inset-0 bg-umber-950/60 flex items-center justify-center">
    <motion.div
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.6, repeat: Infinity }}
      className="t-caps text-gold-500"
    >
      Передаём на кухню…
    </motion.div>
  </div>
)}
```

### 5.5. Success: бронь прошла

Сцена: бокэ фона слегка **осветляется** на 1.5 секунды (эффект «огонь раздул»). Появляется сообщение из `copy_strategy_nomad.md §3.3`.

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
>
  {/* световая вспышка */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 0.3, 0] }}
    transition={{ duration: 1.5 }}
    className="absolute inset-0 pointer-events-none"
    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(232, 168, 79, 0.5), transparent 70%)' }}
  />
  <div className="relative z-10 text-center">
    <h3 className="t-h2 mb-4">
      Стол забронирован. <br />
      <ItalicAccent>Казан уже ставим.</ItalicAccent>
    </h3>
    <p className="t-body text-cream-100/80">Ждём к {time}.</p>
  </div>
</motion.div>
```

### 5.6. Time-of-day atmosphere shift (опционально, v2)

Фоновая тональность страницы меняется в зависимости от реального времени суток:

| Время | Overlay tint | Эффект |
|---|---|---|
| 06–12 | `rgba(232, 213, 176, 0.03)` | Теплее, светлее — «утро у окна» |
| 12–18 | `rgba(0, 0, 0, 0)` | Нейтрально — «день» |
| 18–24 | `rgba(139, 45, 26, 0.04)` | Красноватее — «угли в тандыре» |
| 00–06 | `rgba(26, 74, 107, 0.03)` | Холоднее — «ночная степь» |

Реализация: CSS-переменная на `<html>`, пересчитывается раз в час на клиенте. Не критично для v1 — в roadmap.

---

## 6. Responsive Atmosphere — как меняется по breakpoint

| Breakpoint | Что адаптируется |
|---|---|
| `< 768px` mobile | Blur × 0.7; текстура opacity × 0.8; grain отключен; параллакс отключен; 1 колонка карточек |
| `768–1024px` tablet | Полный blur; 2 колонки карточек; параллакс × 0.5 |
| `≥ 1024px` desktop | Всё по полной |

Параллакс и сложные анимации на мобильных — зло. Отключаем через `useReducedMotion` + media query.

---

## 7. Checklist перед деплоем секции

1. Есть `<Section>` wrapper с правильными `texture` и `bokehImage`?
2. Значения blur/opacity взяты из `config/atmosphere.ts`, не захардкожены?
3. Фото оптимизированы: WebP для еды, JPG quality 82 для атмосферы?
4. Текстуры используются максимум 3 одновременно?
5. Lazy-load на всех фото ниже fold?
6. `prefers-reduced-motion` учитывается параллаксом и дыханием ламп?
7. Mobile-версия отключает параллакс и grain?
8. Real-time состояния (sold-out, loading) не используют красный/спиннер/иконки ошибок?
9. LCP Hero-фото < 2.5s на симуляции 4G?

---

## 8. Что дальше

На этом пакет `Heritage Edition` завершён. Следующие шаги по реализации:

1. **Feed Cursor/Claude Code:** отдать все 4 документа как контекст, попросить собрать `layout.tsx`, `HeroSection.tsx`, `AboutSection.tsx` по спецификации
2. **Получить фото:** 6–8 профессиональных снимков для bokeh-слоёв и галереи (брифовать фотографа по §1.3)
3. **Нарисовать финальные орнаменты:** казахский «кошкар-муйиз», 6 вариантов тарелок — в SVG, с Path2D-оптимизацией
4. **Собрать Storybook** по `ui_kit_material.md` — один раз, чтобы потом не спорить про отступы

Без фото и SVG-ассетов сайт будет выглядеть на 80% — оставшиеся 20% делают материалы.
