Status: Conceptual

> **Heritage note (v1):** орнаменты реализованы через SVG-спрайт **`components/ornaments/OrnamentSprite.tsx`** (defs: `kazakh-main` + 6 `plate-*`), `OrnamentCorner` для `HeroFrame` и `PlateIcon` (используется в `GalleryTile` и как placeholder в `MenuCard/DishCard`). Эффект «вытравленного металла» — CSS-класс `.ornament-engraved` в `app/globals.css` (two-layer `drop-shadow`) + `ornament-breathe` анимация под `prefers-reduced-motion`. Этот файл — историческое видение слоя; канон реализации — **`newdocs/visual_identity_heritage.md`**.

# 🧿 Ornament Design System Layer (v1.0)

## “Kazakh Luxury Minimal System”

---

# 🧠 1. Концепция слоя (самое важное)

Орнамент здесь — НЕ декор.

👉 Это **второй визуальный язык системы**, который работает как:

* подпись бренда
* ритм интерфейса
* эмоциональный якорь
* культурная идентичность

---

## 💡 Принцип:

> UI = функциональность
> Ornament Layer = душа продукта

---

# 🏗️ 2. Роль орнамента в системе

Орнамент используется ТОЛЬКО в 5 случаях:

## 1. Structural separators

Разделение секций

```
Hero → Ornament → Features → Ornament → AI
```

---

## 2. Corner accents

Мини-узоры в углах карточек

---

## 3. Hover state enrichment

При наведении орнамент “оживает”

---

## 4. Background depth layer

opacity 2%–6%, never distracting

---

## 5. Brand signature moments

Hero, CTA, loading

---

# 🎨 3. Визуальные правила (STRICT)

## ❌ Запрещено:

* full-screen pattern background
* яркие цвета орнамента
* анимации с высокой интенсивностью
* использование > 10% opacity в фоне

---

## ✅ Разрешено:

| Usage            | Opacity         | Purpose     |
| ---------------- | --------------- | ----------- |
| Background layer | 0.02–0.06       | depth       |
| Borders          | 0.08–0.12       | structure   |
| Hover            | +20% brightness | interaction |
| CTA highlight    | gold tint       | focus       |

---

# 🧿 4. Орнамент как система (not image)

Ты НЕ просто кладёшь PNG.

Ты создаёшь **design tokens + SVG system**.

---

## 📁 Структура

```bash
/branding
  /ornaments
    kazakh-ornament-primary.svg
    kazakh-ornament-line.svg
    kazakh-ornament-corner.svg
  /patterns
    subtle-grid.svg
```

---

# 🧩 5. SVG базовый орнамент (system-ready)

Вот твой core pattern:

```svg
<svg width="400" height="100" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 50H390" stroke="currentColor" stroke-opacity="0.2"/>
  
  <path d="M50 20L70 50L50 80L30 50L50 20Z" 
        stroke="currentColor" 
        stroke-opacity="0.25"
        fill="none"/>

  <path d="M150 20L170 50L150 80L130 50L150 20Z" 
        stroke="currentColor" 
        stroke-opacity="0.25"
        fill="none"/>

  <path d="M250 20L270 50L250 80L230 50L250 20Z" 
        stroke="currentColor" 
        stroke-opacity="0.25"
        fill="none"/>
</svg>
```

---

# 🎯 6. Tailwind integration layer

Добавляем CSS system:

```css
:root {
  --ornament-opacity: 0.04;
  --ornament-color: 201 169 110; /* gold */
}
```

---

## Utility class:

```css
.ornament-bg {
  background-image: url("/branding/ornaments/kazakh-ornament-primary.svg");
  opacity: var(--ornament-opacity);
  background-repeat: repeat-x;
  background-size: auto 80px;
}

.ornament-line {
  background-image: url("/branding/ornaments/kazakh-ornament-line.svg");
  opacity: 0.06;
}
```

---

# 🧠 7. Где именно использовать (UI map)

## 🟡 HERO

```text
Title
↓
ornament line (animated fade in)
↓
subtitle
```

---

## 🍽 MENU SECTION

Каждая категория:

```
Category Title
ornament divider (thin line)
Menu cards grid
```

---

## 🧾 CARDS

```text
┌──────────────┐
│  corner ornament (opacity 0.08)
│  image
│  title
└──────────────┘
```

---

## ⚡ CTA SECTION

* орнамент behind text (blurred glow)
* gold highlight pulse (slow)

---

# 🎬 8. Motion system для орнамента

Орнамент НЕ статичный.

## Поведение:

### 1. Fade-in on scroll

```tsx
initial={{ opacity: 0 }}
whileInView={{ opacity: 0.06 }}
```

---

### 2. Slow drift (background)

```tsx
animate={{
  x: [0, 10, 0],
}}
transition={{
  duration: 20,
  repeat: Infinity
}}
```

---

### 3. Hover glow

```css
:hover {
  opacity: 0.12;
  filter: drop-shadow(0 0 8px #C9A96E);
}
```

---

# 🧬 9. Brand rule: “Cultural Minimalism”

Это ключевой принцип:

> We don’t decorate UI.
> We embed culture into structure.

---

## ❌ wrong:

* “Kazakh theme design”
* heavy patterns
* ethnic overload

## ✅ right:

* Apple-level minimal UI
* subtle cultural DNA inside layout
* luxury restraint

---

# 💎 10. Final System Architecture

```
UI Layer
   ↓
Functional Components (buttons, cards)
   ↓
Design Tokens (colors, spacing)
   ↓
Ornament Layer (cultural identity)
   ↓
Emotion Layer (motion + light)
```

---

# 🚀 11. Что ты теперь получил

Это уже не “дизайн”.

Это:

### 🧠 Brand Operating System

Ты теперь можешь:

* продавать это как SaaS white-label
* делать рестораны разных культур (Kazakh / Italian / Japanese)
* менять только ornament layer → полностью другой бренд

---