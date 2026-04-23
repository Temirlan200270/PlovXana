import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import type {
  TextureBlendMode,
  TextureTiling,
  VignetteLayer,
} from "@/config/atmosphere";

type Texture = "brick" | "ikat" | "wood" | "pergament" | "none";

/**
 * Пути до текстур. Хардкод намеренно изолирован здесь, чтобы секции не тянули URL вручную.
 * Файлы должны лежать в `/public/photo` (см. `newdocs/atmosphere_config.md §1.1`).
 */
const textureUrl: Record<Exclude<Texture, "none">, string> = {
  brick: "/photo/texture-brick.webp",
  ikat: "/photo/texture-ikat.webp",
  wood: "/photo/texture-ikat.webp",
  pergament: "/photo/texture-ikat.webp",
};

/**
 * Универсальная секция Heritage-лэйаута.
 *
 * Слои (снизу вверх):
 *  1. Bokeh photo с `filter: blur()` + `saturate()` — мягкая атмосфера, без швов.
 *  2. Тёплый оверлей `rgba(umber-950, overlayAlpha)` — глушит цвет ниже.
 *  3. Текстурный слой (repeat или cover) с `mix-blend-mode` — культурный код.
 *  4. Radial-vignette — концентрирует свет в центре, края в тень.
 *  5. Film grain — органика, убирает цифровой «пластик».
 *  6. Контент (z-10).
 */
export function Section({
  texture = "none",
  bokehImage,
  bokehBlurPx,
  bokehOverlayAlpha,
  bokehSaturate,
  textureOpacity = 0.3,
  textureBlendMode = "overlay",
  textureTiling = "repeat",
  vignette,
  grainOpacity = 0.05,
  className,
  children,
}: {
  texture?: Texture;
  bokehImage?: string;
  bokehBlurPx?: number;
  bokehOverlayAlpha?: number;
  bokehSaturate?: number;
  textureOpacity?: number;
  textureBlendMode?: TextureBlendMode;
  textureTiling?: TextureTiling;
  vignette?: VignetteLayer | null;
  grainOpacity?: number;
  className?: string;
  children: ReactNode;
}) {
  const blur = Math.max(0, bokehBlurPx ?? 0);
  const saturate =
    typeof bokehSaturate === "number" ? Math.max(0, bokehSaturate) : 1;

  const textureClass = texture === "none" ? "" : textureUrl[texture];
  const textureBgClass =
    textureTiling === "cover"
      ? "bg-cover bg-center"
      : "bg-repeat bg-[length:600px_600px]";

  return (
    <section className={cn("relative overflow-hidden", className)}>
      {bokehImage ? (
        <>
          <div
            className="absolute -inset-[5%] bg-cover bg-center will-change-[filter]"
            style={{
              backgroundImage: `url(${bokehImage})`,
              filter: `blur(${blur}px) saturate(${saturate})`,
              transform: "scale(1.08)",
              transformOrigin: "center",
            }}
            aria-hidden
          />
          {bokehOverlayAlpha != null ? (
            <div
              className="absolute inset-0"
              style={{ background: `rgba(26, 14, 8, ${bokehOverlayAlpha})` }}
              aria-hidden
            />
          ) : null}
        </>
      ) : null}

      {texture !== "none" && textureClass ? (
        <div
          className={cn(
            "absolute inset-0 pointer-events-none",
            textureBgClass,
          )}
          style={{
            backgroundImage: `url(${textureClass})`,
            opacity: textureOpacity,
            mixBlendMode: textureBlendMode,
          }}
          aria-hidden
        />
      ) : null}

      {vignette ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, transparent ${
              vignette.start * 100
            }%, rgba(26, 14, 8, ${vignette.alpha}) 100%)`,
          }}
          aria-hidden
        />
      ) : null}

      <div
        className="absolute inset-0 bg-film-grain pointer-events-none"
        style={{ opacity: grainOpacity }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-20 md:px-16 md:py-28">
        {children}
      </div>
    </section>
  );
}
