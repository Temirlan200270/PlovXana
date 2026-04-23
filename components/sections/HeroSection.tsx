import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { atmosphere } from "@/config/atmosphere";
import { Section } from "@/components/ui/primitives/Section";
import { HeroFrame } from "@/components/ui/primitives/HeroFrame";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { Button } from "@/components/ui/primitives/Button";
import { FloatingPlates } from "@/components/atmosphere/FloatingPlates";
import { LampGlow } from "@/components/atmosphere/LampGlow";

export function HeroSection({
  copy,
  menuHref,
}: {
  copy: TenantPublicConfig;
  menuHref: string;
}) {
  const a = atmosphere.hero;

  return (
    <Section
      texture="ikat"
      bokehImage="/photo/hero-dombra.webp"
      bokehBlurPx={a.bokeh.blur}
      bokehOverlayAlpha={a.bokeh.overlayAlpha}
      bokehSaturate={a.bokeh.saturate}
      textureOpacity={a.textureIkat.opacity}
      textureBlendMode={a.textureIkat.blendMode}
      textureTiling={a.textureIkat.tiling}
      vignette={a.vignette}
      grainOpacity={a.grain.opacity}
      className="min-h-[880px]"
    >
      <div className="relative pt-12 md:pt-20">
        <LampGlow x="180px" y="220px" />
        <LampGlow x="1100px" y="200px" />

        <div className="relative">
          <FloatingPlates />

          <HeroFrame className="mx-auto max-w-[980px]">
            <div className="t-caps text-center">{copy.heroEyebrow}</div>
            <h1 className="mt-8 text-center t-display">
              {copy.heroTitleLine1} <br />
              <ItalicAccent>{copy.heroTitleAccent}</ItalicAccent>
            </h1>
            <p className="mx-auto mt-8 max-w-[56ch] text-center t-body-lg">
              {copy.heroSub}
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="#reserve" variant="primary" size="md">
                {copy.primaryCtaLabel}
              </Button>
              <Button href={menuHref} variant="secondary" size="md">
                {copy.secondaryCtaLabel}
              </Button>
            </div>
          </HeroFrame>
        </div>

        <div className="mt-14 flex items-center justify-center">
          <div className="t-micro text-muted-400">ПРОКРУТИТЬ</div>
        </div>
      </div>
    </Section>
  );
}
