# Visual Identity — Heritage Edition

> Фундаментальный документ дизайн-системы Plovxana. Заменяет `design_system.md`.
> Цель: задать «материальность» интерфейса — живые цвета, правила слоёв, физику света.
> Стек: **Next.js 14 + Tailwind CSS**.

---

## 1. Философия

Интерфейс Plovxana — это **не страница, а помещение**. У него есть стены (текстуры), свет (лампы и глубина), материалы (металл, ткань, керамика) и воздух (пергамент, дым). Любое решение в коде должно отвечать на вопрос: «добавляет ли это материальности, или делает интерфейс плоским?»

Три принципа:

1. **Никакого чистого чёрного и белого.** `#000` стерилен, `#FFF` офисен. Мы используем обожжённые землистые оттенки.
2. **Свет направленный, а не плоский.** Элементы освещаются сверху-слева — как лампы в зале. Тени падают вправо-вниз.
3. **Орнамент — это конструкция, а не декор.** Он задаёт сетку, границы секций, ритм. Он не «украшает», он держит.

---

## 2. Color Tokens

### 2.1. Базовая палитра

Все цвета именованы по физическим прообразам, а не по ролям. Роли (primary/secondary) описаны отдельно ниже.

| Токен | HEX | Прообраз | Назначение |
|---|---|---|---|
| `umber-950` | `#1A0E08` | Обожжённая глина в тени | Основной фон страницы |
| `umber-900` | `#2A1810` | Тёмное дерево тандыра | Surface: карточки, секции |
| `umber-800` | `#3A2218` | Кирпич в полутени | Hover-состояние поверхностей |
| `umber-700` | `#4A2F1A` | Медь с патиной | Границы между секциями |
| `gold-500` | `#C9A961` | Матовое золото чеканки | Акценты, границы, ключевые CTA |
| `gold-400` | `#E8C982` | Золото на свету | Hover на золотых элементах |
| `gold-600` | `#9B7D3E` | Золото в тени | Active, нижняя грань «объёма» |
| `ember-500` | `#D66A3A` | Охра / уголёк | Вторичные акценты, цифры секций, бейджи |
| `ember-600` | `#8B2D1A` | Терракот | Глубокие плашки, иконки |
| `cream-100` | `#E8D5B0` | Пергамент | Основной текст на тёмном |
| `cream-200` | `#F4E4B8` | Свет свечи на ткани | Заголовки-акценты |
| `muted-400` | `#A89274` | Сухая трава степи | Вторичный текст, подписи |
| `muted-600` | `#5B3A24` | Кожа / сыромять | Декоративные линии, hairline |
| `indigo-500` | `#1A4A6B` | Узбекская керамика | Декоративные элементы посуды |

### 2.2. Семантические роли

```ts
// tokens/colors.ts
export const colors = {
  // Surfaces
  bg:           '#1A0E08',  // umber-950
  surface:      '#2A1810',  // umber-900
  surfaceHover: '#3A2218',  // umber-800

  // Strokes
  border:         '#4A2F1A', // umber-700
  borderAccent:   '#C9A961', // gold-500
  borderHairline: '#5B3A24', // muted-600

  // Text
  textPrimary:   '#E8D5B0', // cream-100
  textHeading:   '#F4E4B8', // cream-200
  textMuted:     '#A89274', // muted-400
  textGold:      '#C9A961', // gold-500
  textEmber:     '#D66A3A', // ember-500

  // CTA
  ctaBg:         '#C9A961', // gold-500
  ctaText:       '#1A0E08', // umber-950 (инвертируется)
  ctaHover:      '#E8C982', // gold-400
} as const;
```

### 2.3. Tailwind config

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        umber:  { 700: '#4A2F1A', 800: '#3A2218', 900: '#2A1810', 950: '#1A0E08' },
        gold:   { 400: '#E8C982', 500: '#C9A961', 600: '#9B7D3E' },
        ember:  { 500: '#D66A3A', 600: '#8B2D1A' },
        cream:  { 100: '#E8D5B0', 200: '#F4E4B8' },
        muted:  { 400: '#A89274', 600: '#5B3A24' },
        indigo: { 500: '#1A4A6B' },
      },
    },
  },
};
```

### 2.4. Правило контраста

Текст на тёмных поверхностях — всегда `cream-100` или темнее для body, `cream-200` для H1–H2. **Никогда** не использовать `#FFF` или `text-white` — ломает атмосферу, глаза «режет» на тёплом фоне.

Золото (`gold-500`) как текст — только для коротких акцентов: ценники, caps-лейблы, ссылки. Никогда для body-параграфа (контрастность падает ниже WCAG AA на длинных строках).

---

## 3. Layering Rules — анатомия фона

Каждая секция страницы собирается из **до 5 слоёв**, наложенных друг на друга. Порядок сверху вниз (z-index растёт):

```
┌─────────────────────────────────┐
│ 5. Content (текст, карточки)   │  z: 50
├─────────────────────────────────┤
│ 4. Ornament scaffold           │  z: 40  — рамки, разделители
├─────────────────────────────────┤
│ 3. Film grain                  │  z: 30  — opacity: 0.04-0.06
├─────────────────────────────────┤
│ 2. Bokeh / photo blur          │  z: 20  — opacity: 0.35-0.55, blur: 40px
├─────────────────────────────────┤
│ 1. Texture (brick / ikat)      │  z: 10  — opacity: 0.3-0.5
├─────────────────────────────────┤
│ 0. Base color (umber-950)      │  z: 0
└─────────────────────────────────┘
```

### 3.1. Текстуры — обязательный слой

Ни одна секция не может быть «пустым цветом». Минимум — тонкий паттерн поверх. Доступные текстуры лежат в `/public/textures/`:

- `brick-herringbone.png` — для футера, «О нас», breadcrumbs
- `ikat-pattern.png` — для Hero-бокэ, карточек-фич
- `pergament-grain.png` — универсальный оверлей (opacity 0.06)
- `wood-grain.png` — для карточек блюд

Применение через Tailwind:

```tsx
<section className="relative bg-umber-950">
  <div className="absolute inset-0 bg-[url('/textures/brick-herringbone.png')] bg-repeat opacity-30 mix-blend-overlay" />
  <div className="absolute inset-0 bg-[url('/textures/pergament-grain.png')] bg-repeat opacity-5 pointer-events-none" />
  <div className="relative z-10">{/* content */}</div>
</section>
```

### 3.2. Bokeh-слой (фото)

Реальные фото (зал, домбра, кирпич) идут как фоновый слой с `blur` и тёмным оверлеем. Цель — дать **цветовое настроение**, не конкретику.

```tsx
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{ backgroundImage: "url('/photos/hall-bokeh.jpg')" }}
/>
<div className="absolute inset-0 backdrop-blur-[40px] bg-umber-950/55" />
```

**Конкретные значения blur/opacity для каждой секции — см. `atmosphere_config.md`.**

### 3.3. Film grain

Лёгкое зерно поверх ВСЕГО поверх фотослоёв, но под контентом. Оживляет. Opacity строго `0.04–0.06`. Если видно — значит слишком много.

---

## 4. Shadow & Light — физика объёма

Плоский орнамент — признак любительской работы. В Heritage всё имеет **направление света**: верх-лево. Элементы либо «выступают» (lift), либо «утоплены» (inset).

### 4.1. Shadow tokens

```js
// tailwind.config.js
boxShadow: {
  // Выступающие элементы (кнопки, карточки)
  'lift-sm':  '0 1px 2px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(201,169,97,0.1)',
  'lift-md':  '0 4px 12px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(201,169,97,0.15)',
  'lift-lg':  '0 12px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(201,169,97,0.2)',

  // Утопленные элементы (инпуты, инкрустация)
  'inset-sm': 'inset 0 1px 2px rgba(0,0,0,0.6), inset 0 -0.5px 0 rgba(201,169,97,0.1)',
  'inset-md': 'inset 0 2px 6px rgba(0,0,0,0.7)',

  // Свечение (focus, активный CTA)
  'ember-glow': '0 0 24px rgba(214,106,58,0.35), 0 0 0 1px #C9A961',
  'gold-rim':   '0 0 0 1px #C9A961, 0 0 0 2px rgba(201,169,97,0.2)',
}
```

### 4.2. Правила применения

| Элемент | Тень |
|---|---|
| Карточка блюда (idle) | `shadow-lift-md` |
| Карточка блюда (hover) | `shadow-lift-lg` + `translate-y-[-2px]` |
| Primary CTA | `shadow-lift-sm` + `shadow-ember-glow` при hover |
| Input / textarea | `shadow-inset-sm` |
| Разделитель орнамент | `shadow-inset-sm` (эффект «высеченности») |
| Золотая рамка Hero | без тени, только `ring-1 ring-gold-500/60` |

### 4.3. Effect: «высеченный» орнамент

Чтобы орнамент выглядел **выжженным/высеченным**, а не налепленным, комбинируем два фильтра:

```css
.ornament-engraved {
  filter:
    drop-shadow(0 1px 0 rgba(232, 201, 130, 0.3))   /* верхний блик */
    drop-shadow(0 -1px 0 rgba(0, 0, 0, 0.6));       /* нижняя тень */
  mix-blend-mode: screen;
}
```

Это даёт эффект рельефа глубиной ~1px без увеличения веса ассета.

---

## 5. Border System — двойная золотая рамка

Фирменная «двойная рамка» из макета — ключевой маркер стиля. Используется для:

- Hero-контейнера
- Карточек фирменных блюд
- Фото-блока в «Наша история»
- Модалки бронирования

Структура:

```tsx
<div className="relative p-6 bg-umber-900">
  {/* Внешняя толстая рамка — золото */}
  <div className="absolute inset-0 ring-1 ring-gold-500" />
  {/* Внутренняя тонкая пунктирная — 8px отступ */}
  <div className="absolute inset-2 ring-[0.5px] ring-gold-500/40 [border-style:dashed]" />
  {/* Уголки-орнаменты опциональны — см. ui_kit_material.md */}
  <div className="relative z-10">{children}</div>
</div>
```

Правило: **если у рамки есть golden ring, у элемента не может быть `rounded-*` больше `rounded-sm` (2px).** Закруглённые золотые рамки выглядят как купоны на скидку. Мы не купонная сеть.

---

## 6. Typography — базовая шкала

> Детальная типографика с letter-spacing и примерами — в `ui_kit_material.md`. Здесь — только токены.

### 6.1. Шрифтовые пары

```tsx
// app/layout.tsx
import { Playfair_Display, Inter } from 'next/font/google';

const serif = Playfair_Display({ subsets: ['latin', 'cyrillic'], variable: '--font-serif', weight: ['400', '500'], style: ['normal', 'italic'] });
const sans  = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans', weight: ['400', '500'] });
```

```js
// tailwind.config.js
fontFamily: {
  serif: ['var(--font-serif)', 'Georgia', 'serif'],
  sans:  ['var(--font-sans)', 'system-ui', 'sans-serif'],
}
```

### 6.2. Правило использования

- **Serif** — заголовки (H1, H2), курсивные акценты, цены, цитаты.
- **Sans** — body, кнопки, лейблы, меню, микрокопи.
- **Caps-лейблы** (номера секций, категории) — `font-sans` + `tracking-[0.3em] uppercase text-xs`.

Никаких третьих шрифтов. Рукописных — особенно. Любая «каллиграфия» делается орнаментом, не шрифтом.

---

## 7. Motion — принципы движения

Движение подчинено атмосфере: медленно, как дым из тандыра. Никаких bouncy-анимаций.

```js
// tailwind.config.js
transitionTimingFunction: {
  'heritage': 'cubic-bezier(0.33, 0.08, 0.17, 1)', // медленный старт, мягкий финиш
}
transitionDuration: {
  '600': '600ms',
  '900': '900ms',
}
```

Дефолтная длительность для hover — `duration-600 ease-heritage`. Для появления секций при скролле — `duration-900`.

Запрещено:

- `ease-bounce`, `spring` физика
- Rotate > 3° на интерактивных элементах
- Parallax с интенсивностью > 30% (тарелки «плывут», а не летают)

---

## 8. Чеклист: «это в стиле Heritage?»

Перед коммитом любого компонента проверь:

1. Использован ли `umber-950` вместо `#000` / `bg-black`?
2. Использован ли `cream-100` вместо `#FFF` / `text-white`?
3. Есть ли хотя бы один слой текстуры на секции?
4. Золотые рамки — без `rounded-lg`?
5. Тени направлены вниз-вправо (`shadow-lift-*`)?
6. Нет `font-bold` (700)? Максимум `font-medium` (500)?
7. Кнопки без `transition-all duration-150`? Минимум `duration-600`?
8. Нет эмодзи в UI? (Только орнамент и SVG-символы)

Если хотя бы один пункт «нет» — компонент не в стиле Heritage.

---

## 9. Что дальше

- `ui_kit_material.md` — конкретные компоненты (Button, Card, Border, Ornament)
- `copy_strategy_nomad.md` — заголовки, микрокопи, тон
- `atmosphere_config.md` — карта ассетов, blur/opacity по секциям, real-time states
