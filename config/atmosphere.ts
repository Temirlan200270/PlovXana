/**
 * Heritage atmosphere config.
 *
 * Все значения blur/opacity/saturate/tiling/vignette вынесены сюда,
 * чтобы секции не хардкодили CSS. Диапазоны — см. `newdocs/atmosphere_config.md §2.2`.
 *
 * Новые поля по сравнению с базой:
 *  - `bokeh.saturate`    — десатурация фото (0.7–1.0), гасит конфликт с Umber & Gold.
 *  - `textureTiling`     — "repeat" для паттерна, "cover" для крупного фото без швов.
 *  - `vignette`          — плотность радиального затемнения к краям (0..1) или null.
 */

export type TextureBlendMode = "overlay" | "soft-light" | "normal";
export type TextureTiling = "repeat" | "cover";

export type BokehLayer = Readonly<{
  blur: number;
  opacity: number;
  overlayAlpha: number;
  saturate?: number;
}>;

export type TextureLayer = Readonly<{
  opacity: number;
  blendMode: TextureBlendMode;
  tiling?: TextureTiling;
}>;

export type GrainLayer = Readonly<{ opacity: number }>;

export type VignetteLayer = Readonly<{
  alpha: number;
  start: number;
}>;

export const atmosphere = {
  hero: {
    bokeh: {
      blur: 60,
      opacity: 0.3,
      overlayAlpha: 0.72,
      saturate: 0.8,
    } satisfies BokehLayer,
    textureIkat: {
      opacity: 0.08,
      blendMode: "soft-light",
      tiling: "cover",
    } satisfies TextureLayer,
    vignette: { alpha: 0.85, start: 0.35 } satisfies VignetteLayer,
    grain: { opacity: 0.05 } satisfies GrainLayer,
    lamps: { glowOpacity: 0.25, glowBlur: 60 },
  },
  about: {
    photoCrisp: { blur: 0, opacity: 1.0, overlayAlpha: 0 },
    textureBrick: {
      opacity: 0.3,
      blendMode: "overlay",
      tiling: "repeat",
    } satisfies TextureLayer,
    grain: { opacity: 0.04 } satisfies GrainLayer,
    frameRing: { outerOpacity: 1.0, innerOpacity: 0.4 },
  },
  menu: {
    textureBrick: {
      opacity: 0.25,
      blendMode: "overlay",
      tiling: "repeat",
    } satisfies TextureLayer,
    grain: { opacity: 0.04 } satisfies GrainLayer,
    dishImage: {
      idle: { opacity: 1.0 },
      soldOut: { opacity: 0.55, saturate: 0.4 },
    },
  },
  gallery: {
    bokeh: {
      blur: 30,
      opacity: 0.35,
      overlayAlpha: 0.7,
    } satisfies BokehLayer,
    textureBrick: {
      opacity: 0.4,
      blendMode: "overlay",
      tiling: "repeat",
    } satisfies TextureLayer,
    textureIkat: {
      opacity: 0.25,
      blendMode: "soft-light",
      tiling: "repeat",
    } satisfies TextureLayer,
    grain: { opacity: 0.05 } satisfies GrainLayer,
    tileImage: { idle: { opacity: 0.7 }, hover: { opacity: 0.9 } },
  },
  reserve: {
    bokeh: {
      blur: 50,
      opacity: 0.3,
      overlayAlpha: 0.6,
    } satisfies BokehLayer,
    grain: { opacity: 0.05 } satisfies GrainLayer,
  },
  footer: {
    textureBrick: {
      opacity: 0.6,
      blendMode: "normal",
      tiling: "repeat",
    } satisfies TextureLayer,
    grain: { opacity: 0.06 } satisfies GrainLayer,
  },
} as const;
