Status: Legacy (Normative для v2.0-видения, **не актуально для v1 Heritage Edition**)

> **Heritage note (v1):** публичная витрина PLOVXAHA использует дизайн-канон **Heritage Edition**. Актуальная палитра (`umber/gold/ember/cream`), типошкала (`t-display → t-micro`), тени (`lift-*` / `inset-*` / `ember-glow`) и `ease-heritage` жёстко зашиты в `tailwind.config.ts` + `app/globals.css`. Нормативные источники — **`newdocs/visual_identity_heritage.md`** и **`newdocs/ui_kit_material.md`**. Этот файл описывает SaaS-vision v2.0 с multi-brand темизацией через CSS-переменные — возвращается как roadmap, когда в систему зайдёт второй ресторан.

# 🎨 **Design System: Restaurant OS (v2.0 — Production Grade)**

---

# 🧠 1. DESIGN PHILOSOPHY (ОСНОВА СИСТЕМЫ)

## 🎯 Core Idea

> “Restaurant OS is not a website — it is a configurable brand experience system.”

Каждый ресторан = отдельный бренд внутри системы.

---

## 🧩 3 УРОВНЯ ДИЗАЙНА

### 1. SYSTEM LEVEL (ядро SaaS)

* нейтральный dark UI
* универсальные компоненты
* минимальный стиль

---

### 2. BRAND LEVEL (настраиваемый)

* цвета
* шрифты
* radius
* акцент

---

### 3. CULTURAL LAYER (🔥 ВАЖНО)

* орнаменты
* паттерны
* визуальные мотивы страны / кухни

👉 вот тут появляется твой казахский стиль

---

# 🎯 2. DESIGN DNA

## Принципы

* “Luxury through silence” (не перегружать UI)
* “Food is hero, UI is shadow”
* “Cultural identity as accent, not noise”

---

# 🎨 3. COLOR SYSTEM (УЛУЧШЕННАЯ АРХИТЕКТУРА)

## 3.1 Base Tokens

```ts
background: #050505
surface: #121212
surface-2: #171717
border: #262626
muted: #737373
```

---

## 3.2 Brand Tokens (динамические)

```ts
primary
primary-foreground
primary-soft
primary-glow
```

👉 теперь это НЕ просто gold
👉 это сменяемая система

---

## 3.3 Semantic Tokens

```ts
success
warning
error
info
```

---

# 🧠 4. TYPOGRAPHY SYSTEM (УЛУЧШЕНО)

## Fonts

### Default:

* Inter (UI)
* Playfair Display (titles)

---

## 🔥 Advanced (SaaS feature)

Каждый ресторан может менять:

```ts
font_heading
font_body
font_accent
```

---

## Scale (оставляем, но расширяем)

Добавляем:

* Display XL (80px)
* Hero Title (56px)

---

# 🧱 5. COMPONENT ARCHITECTURE (10/10)

## 📦 UI LAYER

* Button
* Input
* Card
* Modal
* Badge

---

## 🧩 FEATURE LAYER

* MenuCard
* CartDrawer
* OrderTimeline

---

## 🏢 DOMAIN LAYER

* RestaurantThemeProvider
* MenuRenderer
* OrderProcessor

---

# 🎨 6. MULTI-TENANT DESIGN ENGINE (КЛЮЧЕВОЕ)

## 🧠 Идея

Каждый ресторан имеет:

```ts
theme_config = {
  colors: {},
  fonts: {},
  radius: {},
  effects: {}
}
```

---

## ⚙️ Theme Provider

```tsx
<RestaurantThemeProvider theme={restaurant.theme_config}>
  <App />
</RestaurantThemeProvider>
```

---

# 🧿 7. CULTURAL DESIGN LAYER (🔥 ТВОЙ ВОПРОС)

## ❓ Можно ли добавить казахские орнаменты?

👉 **Да — и это ОЧЕНЬ сильная фича, если сделать правильно.**

---

## 🧠 Как это правильно реализовать (10/10 подход)

### ❌ НЕ правильно:

* перегружать фон узорами
* делать “национальный сайт 2008 года”

---

### ✅ ПРАВИЛЬНО:

## 🌿 1. ORNAMENT AS “WATERMARK LAYER”

* очень низкая opacity (3–8%)
* только в фоне
* не мешает тексту

```css
background-image: url("/ornaments/kazakh-pattern.svg");
opacity: 0.05;
```

---

## 🌿 2. ORNAMENT AS DIVIDER

Используем как:

* разделители секций
* линии
* декоративные полосы

---

## 🌿 3. ORNAMENT AS ACCENT

* hover states
* loading animations
* borders карточек

---

## 🌿 4. ORNAMENT SYSTEM (ADVANCED)

```ts
ornament_style: {
  type: "kazakh | modern | none",
  intensity: "low | medium | high"
}
```

---

# 🇰🇿 8. KAZAKH DESIGN MODE (ОЧЕНЬ СИЛЬНАЯ ИДЕЯ)

Ты можешь сделать:

## 💡 “Cultural Themes Engine”

Примеры:

* Kazakh Restaurant → орнаменты
* Japanese → minimal wave patterns
* Italian → marble textures
* Arabic → geometric patterns

---

## 🔥 Это уже SaaS дифференциатор

👉 никто в ресторанных SaaS это нормально не делает

---

# 🎬 9. MOTION SYSTEM (УЛУЧШЕН)

## Principles:

* slow luxury motion
* no abrupt transitions
* physics-based easing

---

## Presets:

```ts
fadeUp
scaleSoft
staggerReveal
float
```

---

# ⚡ 10. PERFORMANCE DESIGN RULES

* no heavy background images
* ornaments = SVG only
* lazy load visuals
* compress all assets

---

# 🧠 11. UX SYSTEM

## Micro-interactions

* hover glow (gold soft)
* button press depth
* card lift effect

---

## Feedback

* success = soft green glow
* error = shake + red fade
* loading = skeleton shimmer

---

# 🌍 12. SEO + CULTURAL SEO (NEW)

## JSON-LD + Culture tag

```json
"servesCuisine": "Kazakh, Central Asian"
```

---

👉 это усиливает локальный поиск

---

# 🧩 13. THEME EXAMPLES

## 🟤 Kazakh Mode

```ts
primary: "#C9A96E"
ornament: "kazakh-pattern.svg"
font: "Playfair + Inter"
```

---

## ⚫ Ultra Minimal Mode

```ts
primary: "#FFFFFF"
ornament: none
background: pure black
```

---

# 🚀 14. FINAL SYSTEM VIEW

Ты строишь:

## ❌ не сайт

## ❌ не UI kit

## ✅ CONFIGURABLE DESIGN ENGINE

---
