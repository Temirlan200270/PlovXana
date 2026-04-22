Status: Conceptual

🌍 Cultural Theme Engine (v1.0)
🧠 Идея

Каждый ресторан получает не просто цвета, а:

🎨 palette (цвета)
🧿 ornament layer (паттерны)
🖋 typography pairing
🌫 atmosphere (blur, grain, glow)
🎭 motion style (скорость/плавность)
🍽 UI personality (строгий / тёплый / премиум / живой)

🏗 1. Архитектура системы
/lib/themes/
  types.ts
  engine.ts
  kazakh.ts
  japanese.ts
  italian.ts
  arabic.ts
  default.ts

/components/theme/
  ThemeProvider.tsx
  useTheme.ts
  applyTheme.ts

/public/textures/
  kazakh.svg
  arabic-pattern.svg
  japanese-noise.png
🎨 2. Theme Type (ядро системы)
export type CulturalTheme = {
  id: string;

  colors: {
    background: string;
    surface: string;
    primary: string;
    accent: string;
    text: string;
    muted: string;
  };

  typography: {
    heading: string;
    body: string;
  };

  ornament: {
    texture: string; // svg / png
    opacity: number;
    blendMode: "overlay" | "soft-light" | "multiply" | "normal";
  };

  motion: {
    parallaxIntensity: number;
    spring: {
      stiffness: number;
      damping: number;
    };
  };

  radius: number;

  atmosphere: {
    grain: number;
    glow: number;
    contrast: number;
  };
};
🧬 3. Theme Engine (сердце системы)
import { CulturalTheme } from "./types";

export function applyTheme(theme: CulturalTheme) {
  const root = document.documentElement;

  // COLORS
  root.style.setProperty("--bg", theme.colors.background);
  root.style.setProperty("--surface", theme.colors.surface);
  root.style.setProperty("--primary", theme.colors.primary);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--text", theme.colors.text);

  // TYPOGRAPHY
  root.style.setProperty("--font-heading", theme.typography.heading);
  root.style.setProperty("--font-body", theme.typography.body);

  // MOTION
  root.style.setProperty("--motion-intensity", String(theme.motion.parallaxIntensity));

  // RADIUS
  root.style.setProperty("--radius", `${theme.radius}px`);

  // ATMOSPHERE
  root.style.setProperty("--grain", String(theme.atmosphere.grain));
}
🧿 4. KAZAKH THEME (твой кейс — идеально подходит)
import { CulturalTheme } from "./types";

export const kazakhTheme: CulturalTheme = {
  id: "kazakh",

  colors: {
    background: "#050505",
    surface: "#121212",
    primary: "#C9A96E", // gold
    accent: "#E5C58B",
    text: "#FFFFFF",
    muted: "#A1A1A1",
  },

  typography: {
    heading: "serif", // Playfair / Cormorant
    body: "sans",     // Inter
  },

  ornament: {
    texture: "/textures/kazakh.svg",
    opacity: 0.06,
    blendMode: "overlay",
  },

  motion: {
    parallaxIntensity: 0.35,
    spring: {
      stiffness: 260,
      damping: 25,
    },
  },

  radius: 16,

  atmosphere: {
    grain: 0.04,
    glow: 0.25,
    contrast: 1.1,
  },
};
🏛 5. JAPANESE THEME (минимализм + воздух)
export const japaneseTheme: CulturalTheme = {
  id: "japanese",

  colors: {
    background: "#0B0B0C",
    surface: "#151517",
    primary: "#FFFFFF",
    accent: "#E11D48",
    text: "#F5F5F5",
    muted: "#8A8A8A",
  },

  typography: {
    heading: "serif",
    body: "sans",
  },

  ornament: {
    texture: "/textures/japanese-noise.png",
    opacity: 0.03,
    blendMode: "soft-light",
  },

  motion: {
    parallaxIntensity: 0.15, // медленный стиль
    spring: {
      stiffness: 120,
      damping: 30,
    },
  },

  radius: 10,

  atmosphere: {
    grain: 0.02,
    glow: 0.1,
    contrast: 0.9,
  },
};
🕌 6. ARABIC LUXURY THEME (дорогой ресторан / золото / глубина)
export const arabicTheme: CulturalTheme = {
  id: "arabic",

  colors: {
    background: "#070508",
    surface: "#141018",
    primary: "#D4AF37",
    accent: "#F5D57A",
    text: "#FFFFFF",
    muted: "#B3A6A0",
  },

  typography: {
    heading: "serif",
    body: "sans",
  },

  ornament: {
    texture: "/textures/arabic-pattern.svg",
    opacity: 0.08,
    blendMode: "overlay",
  },

  motion: {
    parallaxIntensity: 0.4,
    spring: {
      stiffness: 300,
      damping: 22,
    },
  },

  radius: 18,

  atmosphere: {
    grain: 0.05,
    glow: 0.35,
    contrast: 1.2,
  },
};
⚙️ 7. Theme Provider (React)
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CulturalTheme } from "@/lib/themes/types";
import { applyTheme } from "@/lib/themes/engine";

const ThemeContext = createContext<any>(null);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: CulturalTheme;
  children: React.ReactNode;
}) {
  const [currentTheme, setCurrentTheme] = useState(theme);

  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
      <div
        className="min-h-screen"
        style={{
          background: "var(--bg)",
          color: "var(--text)",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
🌫 8. Global Ornament Layer (очень важно)
export function OrnamentLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url(/textures/kazakh.svg)",
          backgroundSize: "cover",
          mixBlendMode: "overlay",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.15),transparent)]" />
    </div>
  );
}