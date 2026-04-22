Status: Conceptual

# 🌍 Dynamic Cultural Theme System (v1.0)

## “Multi-brand UI engine for Restaurant OS”

---

# 🧠 1. Что мы строим

Ты получаешь систему, где:

> Один код → бесконечное количество культурных дизайнов

---

## Примеры:

| Restaurant Type   | Theme                                    |
| ----------------- | ---------------------------------------- |
| Kazakh cuisine    | gold + ornament + warm luxury            |
| Japanese sushi    | minimal black + red accent + ink texture |
| Italian trattoria | warm cream + terracotta                  |
| Steakhouse        | dark leather + red neon                  |

---

# 🏗️ 2. Архитектура системы

```bash id="x6c8f1"
/theme
  /core
    theme-provider.tsx
    theme-types.ts
    theme-engine.ts
  /presets
    kazakh.ts
    japanese.ts
    italian.ts
    steakhouse.ts
  /hooks
    useTheme.ts
```

---

# 🎨 3. Theme Model (ядро системы)

```ts id="9k2xq1"
export type ThemePreset = {
  id: string;

  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
  };

  typography: {
    headingFont: string;
    bodyFont: string;
  };

  ornament: {
    patternUrl: string;
    opacity: number;
    mode: "subtle" | "visible";
  };

  motion: {
    intensity: "low" | "medium" | "high";
  };
};
```

---

# 🧠 4. Theme Engine (сердце системы)

```ts id="k9v3la"
import { ThemePreset } from "./theme-types";

export function applyTheme(theme: ThemePreset) {
  const root = document.documentElement;

  root.style.setProperty("--bg", theme.colors.background);
  root.style.setProperty("--surface", theme.colors.surface);
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--text", theme.colors.text);

  root.style.setProperty("--ornament-opacity", String(theme.ornament.opacity));
}
```

---

# 🧩 5. Theme Provider (React Layer)

```tsx id="p1k8zq"
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { applyTheme } from "./theme-engine";
import { ThemePreset } from "./theme-types";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemePreset;
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

---

# 🧿 6. Kazakh Theme (твой кейс)

```ts id="kz_theme"
import { ThemePreset } from "../core/theme-types";

export const kazakhTheme: ThemePreset = {
  id: "kazakh",

  colors: {
    background: "#050505",
    surface: "#121212",
    primary: "#C9A96E",
    accent: "#E5C58B",
    text: "#FFFFFF",
  },

  typography: {
    headingFont: "Playfair Display",
    bodyFont: "Inter",
  },

  ornament: {
    patternUrl: "/branding/ornaments/kazakh-ornament-primary.svg",
    opacity: 0.04,
    mode: "subtle",
  },

  motion: {
    intensity: "medium",
  },
};
```

---

# 🇯🇵 7. Japanese Theme (пример смены культуры)

```ts id="jp_theme"
export const japaneseTheme = {
  id: "japanese",

  colors: {
    background: "#0A0A0A",
    surface: "#111111",
    primary: "#E11D48", // red accent
    accent: "#FFFFFF",
    text: "#E5E5E5",
  },

  typography: {
    headingFont: "Noto Serif JP",
    bodyFont: "Inter",
  },

  ornament: {
    patternUrl: "/patterns/ink-wave.svg",
    opacity: 0.03,
    mode: "subtle",
  },

  motion: {
    intensity: "low",
  },
};
```

---

# ⚡ 8. Dynamic switching (SaaS feature)

```tsx id="switch_theme"
import { useTheme } from "@/theme/core/theme-provider";
import { kazakhTheme } from "@/theme/presets/kazakh";
import { japaneseTheme } from "@/theme/presets/japanese";

export function ThemeSwitcher() {
  const { setCurrentTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button onClick={() => setCurrentTheme(kazakhTheme)}>
        Kazakh
      </button>

      <button onClick={() => setCurrentTheme(japaneseTheme)}>
        Japanese
      </button>
    </div>
  );
}
```

---

# 🧠 9. ORNAMENT LAYER integration

Теперь твой орнамент становится:

```css id="orn_layer"
body {
  background-image: url(var(--ornament-url));
  opacity: var(--ornament-opacity);
}
```

или React:

```tsx id="orn_component"
export function OrnamentLayer() {
  return (
    <div
      className="fixed inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: `url(var(--ornament-url))`,
      }}
    />
  );
}
```

---

# 🧩 10. Как это работает в Next.js 14

```tsx id="layout"
import { ThemeProvider } from "@/theme/core/theme-provider";
import { kazakhTheme } from "@/theme/presets/kazakh";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={kazakhTheme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

# 🚀 11. Что ты теперь получил

## 🔥 Это важно:

Ты теперь имеешь:

### 🧠 1. Multi-brand engine

→ один код = разные рестораны

### 🎨 2. Cultural UI system

→ Kazakh / Japanese / Italian / Steakhouse

### 🧩 3. SaaS-ready architecture

→ каждый клиент = отдельная тема

### ⚡ 4. Product-level differentiation

→ это уже НЕ шаблон сайта

---

# 💎 12. Почему это 10/10 система

Потому что:

* Stripe = theme tokens
* Vercel = branding system
* Linear = design language engine

👉 ты делаешь то же самое, но для ресторанов

---