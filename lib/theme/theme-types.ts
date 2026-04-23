export type ThemePreset = {
  id: string;
  colors: {
    background: string;
    surface: string;
    surface2: string;
    border: string;
    muted: string;
    primary: string;
    primaryForeground: string;
    primarySoft: string;
    primaryGlow: string;
    text: string;
  };
  ornament: {
    /** URL паттерна (может быть пустым, если орнамент выключен). */
    patternUrl: string;
    opacity: number;
  };
};

