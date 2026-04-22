# UI Kit Material — Heritage Edition

> Спецификация компонентов Plovxana. Зависит от `visual_identity_heritage.md` (токены, слои, свет).
> Стек: **Next.js 14 + Tailwind CSS + React Server Components** где возможно.
> Принцип: каждый компонент — артефакт. Он имеет материал, вес, край и свет.

---

## 1. The Border System — двойные рамки

Центральный визуальный паттерн. Делится на 4 типа.

### 1.1. Тип A: Hero Frame (двойная с уголками)

Самый «богатый» вариант. Используется 1 раз на страницу — в Hero или ключевом CTA-блоке.

```tsx
// components/ui/HeroFrame.tsx
export function HeroFrame({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* внешняя золотая линия */}
      <div className="absolute inset-0 ring-1 ring-gold-500" aria-hidden />
      {/* внутренняя пунктирная */}
      <div className="absolute inset-2 ring-[0.5px] ring-gold-500/40 [border-style:dashed] pointer-events-none" aria-hidden />
      {/* угловые орнаменты */}
      <OrnamentCorner position="tl" />
      <OrnamentCorner position="tr" />
      <OrnamentCorner position="bl" />
      <OrnamentCorner position="br" />
      <div className="relative z-10 p-8 md:p-12">{children}</div>
    </div>
  );
}
```

**Правило:** размер внутреннего отступа — всегда кратен 8px. Минимум `p-8` на мобильных, `p-12` на десктопе. Никогда не меньше — иначе рамка «душит» контент.

### 1.2. Тип B: Card Frame (двойная без уголков)

Для карточек блюд, тайлов галереи. Меньше «шума».

```tsx
<div className="relative bg-umber-900 shadow-lift-md">
  <div className="absolute inset-0 ring-1 ring-gold-500/80" />
  <div className="absolute inset-[6px] ring-[0.5px] ring-gold-500/20" />
  <div className="relative p-6">{children}</div>
</div>
```

### 1.3. Тип C: Hairline Divider (одинарная золотая)

Между блоками внутри секции. Без драмы.

```tsx
<hr className="h-px border-0 bg-gold-500/30" />
```

### 1.4. Тип D: Ornament Divider (орнаментальный разделитель)

Между крупными секциями. См. компонент `<SectionDivider />` ниже.

### 1.5. Что запрещено

- `rounded-md` и выше на любой рамке с золотом (только `rounded-none` или `rounded-sm`)
- `border-2` и толще на золоте (золото — это нить, не стена)
- Двойные рамки с разными цветами (только золото+золото разной интенсивности)

---

## 2. Iconography Specs

Lucide-иконки и Heroicons **запрещены** для ключевых секций и навигации. Они делают сайт «технологичным», а мы — дастархан.

### 2.1. Три уровня иконографики

| Уровень | Что использовать | Где |
|---|---|---|
| 1. Секционные маркеры | Стилизованная тарелка (SVG) с вариациями паттерна | Заголовки секций, «О нас», категории меню |
| 2. Функциональные | Lucide (только `stroke-width={1}`, цвет `gold-500`) | Стрелки, закрыть модал, play/pause |
| 3. Декоративные | Казахский орнамент «кошкар-муйиз» (SVG-символ) | Разделители, углы, фоны |

### 2.2. Ceramic Plate Icon (уровень 1)

Базовый компонент-маркер. Варьируется паттерном в центре — это и есть «иконка секции».

```tsx
// components/ornaments/PlateIcon.tsx
type Variant = 'plov' | 'kazy' | 'samsa' | 'tea' | 'dessert' | 'default';

export function PlateIcon({ variant = 'default', size = 48 }: { variant?: Variant; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`${variant} plate`}>
      <circle cx="50" cy="50" r="48" fill="#2A1810" stroke="#C9A961" strokeWidth="1" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#1A4A6B" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#C9A961" strokeWidth="0.5" strokeDasharray="3 2" />
      <PlatePattern variant={variant} />
    </svg>
  );
}
```

Паттерны в центре (`<PlatePattern />`) — отдельные SVG-фрагменты под каждую категорию. Размеры: `32px` inline, `48px` в заголовках категорий, `80px` в Hero-секции «О нас».

### 2.3. Kazakh Ornament (уровень 3)

Используется как SVG-символ с `<use>`, чтобы переиспользовать через страницу без дублирования разметки.

```tsx
// components/ornaments/OrnamentSprite.tsx — загружается в layout.tsx один раз
export function OrnamentSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <symbol id="kazakh-ornament" viewBox="0 0 80 80">
          {/* ... paths ... */}
        </symbol>
      </defs>
    </svg>
  );
}

// Использование:
<svg width={40} height={40}><use href="#kazakh-ornament" /></svg>
```

### 2.4. Правила размеров

- Иконки в тексте: **16px** (не больше)
- Маркеры секций: **32px** или **48px**
- Декоративные элементы: **60–80px**
- Всегда `aria-hidden="true"` на декоративных, `role="img"` + `aria-label` на функциональных

---

## 3. Typography Scale

### 3.1. Детальная шкала

| Уровень | Класс | Размер | Weight | Letter-spacing | Line-height | Применение |
|---|---|---|---|---|---|---|
| Display | `.t-display` | 82px / 56px mob | 400 | `-0.02em` | 1.05 | Hero только |
| H1 | `.t-h1` | 54px / 38px mob | 400 | `-0.01em` | 1.1 | Заголовок секции |
| H2 | `.t-h2` | 42px / 30px mob | 400 | `-0.005em` | 1.15 | Подзаголовок секции |
| H3 | `.t-h3` | 26px / 22px mob | 500 | `0` | 1.25 | Название блюда, карточки |
| Body | `.t-body` | 16px | 400 | `0.01em` | 1.7 | Параграфы |
| Body-lg | `.t-body-lg` | 18px | 400 | `0.01em` | 1.65 | Lead-параграф |
| Caps | `.t-caps` | 12px | 500 | `0.3em` | 1.2 | Номера секций, лейблы |
| Micro | `.t-micro` | 10px | 500 | `0.25em` | 1.2 | Футер, подписи |

### 3.2. Реализация через Tailwind

Поскольку `letter-spacing` и комбинации повторяются, вынесем в `@layer components`:

```css
/* app/globals.css */
@layer components {
  .t-display {
    @apply font-serif text-[56px] md:text-[82px] font-normal leading-[1.05] tracking-tight text-cream-200;
  }
  .t-h1 {
    @apply font-serif text-[38px] md:text-[54px] font-normal leading-[1.1] text-cream-200;
  }
  .t-h2 {
    @apply font-serif text-[30px] md:text-[42px] font-normal leading-[1.15] text-cream-200;
  }
  .t-h3 {
    @apply font-serif text-[22px] md:text-[26px] font-medium leading-[1.25] text-cream-100;
  }
  .t-body {
    @apply font-sans text-base leading-[1.7] text-cream-100/85;
  }
  .t-body-lg {
    @apply font-sans text-lg leading-[1.65] text-cream-100/90;
  }
  .t-caps {
    @apply font-sans text-xs font-medium tracking-[0.3em] uppercase text-ember-500;
  }
  .t-micro {
    @apply font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-muted-400;
  }
}
```

### 3.3. Italic accent (курсивная строка)

Фирменный приём из макета: вторая строка заголовка в `italic` + золотой градиент. Компонент:

```tsx
export function ItalicAccent({ children }: { children: React.ReactNode }) {
  return (
    <span className="italic bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 bg-clip-text text-transparent">
      {children}
    </span>
  );
}

// Usage:
<h1 className="t-h1">
  Огонь, который <br />
  <ItalicAccent>помнит предков.</ItalicAccent>
</h1>
```

**Правило:** `ItalicAccent` используется **1 раз на секцию**, максимум. Это драгоценность, а не обои.

---

## 4. Button System

Три варианта. Больше не нужно.

### 4.1. Primary — «Золотой»

Единственная кнопка, заливаемая золотом. Используется ровно для одного действия на экране: бронирование.

```tsx
// components/ui/Button.tsx
export function ButtonPrimary({ children, onClick, href }: ButtonProps) {
  const Component = href ? 'a' : 'button';
  return (
    <Component
      href={href}
      onClick={onClick}
      className="
        group relative inline-flex items-center justify-center
        px-10 py-4
        bg-gold-500 text-umber-950
        font-sans text-xs font-medium tracking-[0.3em] uppercase
        shadow-lift-sm
        transition-all duration-600 ease-heritage
        hover:bg-gold-400 hover:shadow-lift-md hover:shadow-ember-glow
        active:scale-[0.98]
      "
    >
      <span className="absolute inset-[2px] ring-[0.5px] ring-umber-950/40 pointer-events-none" />
      <span className="relative">{children}</span>
    </Component>
  );
}
```

### 4.2. Secondary — «Обводка»

```tsx
<button className="
  inline-flex items-center justify-center
  px-10 py-4
  bg-transparent text-gold-500
  font-sans text-xs font-medium tracking-[0.3em] uppercase
  ring-1 ring-gold-500
  transition-all duration-600 ease-heritage
  hover:bg-gold-500/10 hover:text-gold-400
">
  Смотреть меню
</button>
```

### 4.3. Ghost — «Текстовая»

Для ссылок внутри блоков: «Узнать больше →», «Все блюда →».

```tsx
<a className="
  inline-flex items-center gap-3
  font-sans text-xs font-medium tracking-[0.3em] uppercase text-gold-500
  border-t border-gold-500 pt-3
  transition-colors duration-600 ease-heritage
  hover:text-gold-400
">
  Узнать больше
  <span aria-hidden>→</span>
</a>
```

### 4.4. Что запрещено

- `rounded-full`, `rounded-lg` на кнопках (только `rounded-none`)
- Три и больше кнопок в одном блоке (иерархия ломается)
- Иконка слева от текста на primary (только справа, как стрелка)
- `font-bold` — никогда

---

## 5. Card Components

### 5.1. Dish Card (карточка блюда)

```tsx
// components/cards/DishCard.tsx
type Props = {
  name: string;
  subtitle: string;        // "БАРАНИНА · АЙВА · ЗИРА"
  price: number;           // 6400
  imageUrl: string;
  featured?: boolean;      // показать бейдж "Авторское"
  soldOut?: boolean;       // сломанная тарелка, см. atmosphere_config.md §5
};

export function DishCard({ name, subtitle, price, imageUrl, featured, soldOut }: Props) {
  return (
    <article className={`
      relative bg-umber-900 shadow-lift-md
      transition-all duration-600 ease-heritage
      hover:shadow-lift-lg hover:-translate-y-0.5
      ${soldOut ? 'opacity-60 grayscale-[0.3]' : ''}
    `}>
      <div className="absolute inset-0 bg-[url('/textures/brick-herringbone.png')] opacity-30 mix-blend-overlay" />
      <div className="absolute inset-0 ring-1 ring-gold-500/80" />
      <div className="absolute inset-[6px] ring-[0.5px] ring-gold-500/20" />

      {featured && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-ember-500 px-4 py-1">
          <span className="t-micro text-umber-950">Авторское</span>
        </div>
      )}

      <div className="relative p-6 flex flex-col items-center text-center">
        <div className="w-56 h-56 mb-6">
          <Image src={imageUrl} alt={name} width={220} height={220} className="object-cover" />
        </div>
        <h3 className="t-h3 mb-2">{name}</h3>
        <p className="t-micro mb-4">{subtitle}</p>
        <hr className="w-20 h-px bg-gold-500/40 border-0 mb-4" />
        <p className="font-serif text-2xl text-gold-500">₸ {price.toLocaleString('ru-RU')}</p>
      </div>
    </article>
  );
}
```

### 5.2. Stat Card (статистика)

Используется в «О нас»: «04 поколения», «37 блюд», «1924 год».

```tsx
<div className="flex flex-col">
  <span className="font-serif text-5xl font-normal bg-gradient-to-br from-gold-400 to-gold-600 bg-clip-text text-transparent">
    {value}
  </span>
  <span className="t-micro mt-1">{label}</span>
</div>
```

### 5.3. Gallery Tile (плитка галереи)

Для секции атмосферы. 4 тайла в ряд на десктопе, 2×2 на планшете, стек на мобильном.

```tsx
<div className="relative aspect-[3/4] bg-umber-900 overflow-hidden group">
  <div className="absolute inset-0 bg-[url('/textures/ikat-pattern.png')] opacity-40 mix-blend-overlay" />
  <Image src={imageUrl} alt={caption} fill className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-600" />
  <div className="absolute inset-2.5 ring-[0.5px] ring-gold-500/50" />
  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-umber-950 to-transparent">
    <span className="t-micro">{caption}</span>
  </div>
</div>
```

---

## 6. Form Elements

### 6.1. Input

```tsx
<input
  type="text"
  className="
    w-full px-4 py-3
    bg-umber-900 text-cream-100
    font-sans text-base
    ring-[0.5px] ring-gold-500/60
    shadow-inset-sm
    placeholder:text-muted-400
    focus:ring-1 focus:ring-gold-500 focus:outline-none
    transition-all duration-600 ease-heritage
  "
/>
```

### 6.2. Select (Дата, Время, Гости в форме бронирования)

Стилизация нативного select через `appearance-none`:

```tsx
<div className="relative">
  <select className="... (те же классы что Input) appearance-none pr-10">
    <option>...</option>
  </select>
  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold-500 pointer-events-none">▾</span>
</div>
```

---

## 7. Section Divider (компонент)

```tsx
// components/ornaments/SectionDivider.tsx
export function SectionDivider({ count = 1 }: { count?: 1 | 3 | 5 }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="flex-1 h-px bg-gold-500/30 max-w-[30%]" />
      <div className="flex items-center gap-2 px-6">
        {Array.from({ length: count }).map((_, i) => (
          <svg key={i} width={count === 1 ? 48 : 32} height={count === 1 ? 48 : 32} aria-hidden className="ornament-engraved" style={{ opacity: i === Math.floor(count / 2) ? 1 : 0.6 }}>
            <use href="#kazakh-ornament" />
          </svg>
        ))}
      </div>
      <div className="flex-1 h-px bg-gold-500/30 max-w-[30%]" />
    </div>
  );
}
```

Используется между секциями. `count={5}` — между ключевыми секциями (История → Меню), `count={3}` — между второстепенными, `count={1}` — мини-разделитель внутри секции.

---

## 8. Layout Primitives

### 8.1. Section

Обёртка любой секции страницы. Управляет фоном и слоями.

```tsx
type SectionProps = {
  texture?: 'brick' | 'ikat' | 'wood' | 'none';
  bokehImage?: string;      // URL фонового фото
  bokehOpacity?: number;    // 0.3–0.6
  className?: string;
  children: React.ReactNode;
};

export function Section({ texture = 'none', bokehImage, bokehOpacity = 0.4, className, children }: SectionProps) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      {bokehImage && (
        <>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bokehImage})` }} />
          <div className="absolute inset-0 backdrop-blur-[40px]" style={{ background: `rgba(26, 14, 8, ${1 - bokehOpacity})` }} />
        </>
      )}
      {texture !== 'none' && (
        <div className={`absolute inset-0 bg-[url('/textures/${textureMap[texture]}')] bg-repeat opacity-30 mix-blend-overlay pointer-events-none`} />
      )}
      <div className="absolute inset-0 bg-[url('/textures/pergament-grain.png')] opacity-[0.05] pointer-events-none" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-16 py-20 md:py-28">
        {children}
      </div>
    </section>
  );
}

const textureMap = { brick: 'brick-herringbone.png', ikat: 'ikat-pattern.png', wood: 'wood-grain.png' };
```

### 8.2. Container

Для типовых блоков. Максимальная ширина контента — **1280px**. Внутри карточек — **не шире 1120px** (чтобы боковые тарелки дышали).

---

## 9. Navigation

```tsx
// components/nav/TopNav.tsx
export function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-umber-950/80 backdrop-blur-md border-b border-gold-500/30">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 md:px-16 h-20">
        <Logo />
        <nav className="hidden md:flex items-center gap-10">
          <NavLink href="/menu">Menu</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/gallery">Gallery</NavLink>
          <NavLink href="/reserve">Reserve</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>
        <div className="flex items-center gap-4">
          <LangSwitcher />
          <ButtonPrimary href="/reserve" className="hidden md:inline-flex">Book a table</ButtonPrimary>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="
      t-micro text-cream-100/80 relative
      transition-colors duration-600 ease-heritage
      hover:text-gold-500
    ">
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-500 transition-all duration-600 ease-heritage group-hover:w-full" />
    </Link>
  );
}
```

---

## 10. Что дальше

- `copy_strategy_nomad.md` — тексты, которые загружаются в эти компоненты
- `atmosphere_config.md` — какие фото идут в `bokehImage`, какие значения blur/opacity, real-time states

---

## Приложение А — порядок реализации (для Cursor)

1. Установить шрифты (`Playfair_Display`, `Inter`) в `layout.tsx`
2. Расширить `tailwind.config.js` токенами из §2.3, §7 (boxShadow)
3. Добавить `@layer components` с typography scale в `globals.css`
4. Положить текстуры в `/public/textures/`
5. Создать `OrnamentSprite` и загрузить в `layout.tsx`
6. Собрать примитивы: `HeroFrame`, `Section`, `SectionDivider`, `Button*`
7. Собрать бизнес-компоненты: `DishCard`, `StatCard`, `GalleryTile`
8. Собрать навигацию и футер
9. Собирать страницы из готовых блоков
