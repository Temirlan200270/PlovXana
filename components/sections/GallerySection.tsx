import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { atmosphere } from "@/config/atmosphere";
import { Section } from "@/components/ui/primitives/Section";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { GalleryTile } from "@/components/cards/GalleryTile";

export function GallerySection({ copy }: { copy: TenantPublicConfig }) {
  const a = atmosphere.gallery;

  return (
    <Section
      bokehImage="/photo/atmosphere-warm.jpg"
      bokehBlurPx={a.bokeh.blur}
      bokehOverlayAlpha={a.bokeh.overlayAlpha}
      texture="brick"
      textureOpacity={a.textureBrick.opacity}
      textureBlendMode={a.textureBrick.blendMode}
      grainOpacity={a.grain.opacity}
      className="bg-umber-950"
    >
      <div id="gallery">
        <div className="t-caps text-center">{copy.galleryEyebrow}</div>
        <h2 className="mt-6 text-center t-h1">
          {copy.galleryTitleLine1} <br />
          <ItalicAccent>{copy.galleryTitleAccent}</ItalicAccent>
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {copy.galleryTiles.map((t) => (
            <GalleryTile
              key={`${t.caption}-${t.variant}`}
              caption={t.caption}
              variant={t.variant}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

