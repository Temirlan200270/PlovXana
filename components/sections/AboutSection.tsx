import Image from "next/image";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { atmosphere } from "@/config/atmosphere";
import { Section } from "@/components/ui/primitives/Section";
import { CardFrame } from "@/components/ui/primitives/CardFrame";
import { ItalicAccent } from "@/components/ui/primitives/ItalicAccent";
import { StatCard } from "@/components/cards/StatCard";

export function AboutSection({ copy }: { copy: TenantPublicConfig }) {
  const a = atmosphere.about;

  return (
    <Section
      texture="brick"
      grainOpacity={a.grain.opacity}
      textureOpacity={a.textureBrick.opacity}
      textureBlendMode={a.textureBrick.blendMode}
      className="bg-umber-950"
    >
      <div id="about" className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="t-caps">{copy.aboutEyebrow}</div>

          <div className="mt-8">
            <CardFrame className="overflow-hidden">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={copy.aboutPhotoUrl}
                  alt="Plovxana"
                  fill
                  className="object-cover opacity-90"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: `rgba(26, 14, 8, ${a.photoCrisp.overlayAlpha})` }}
                  aria-hidden
                />
              </div>
            </CardFrame>
          </div>
        </div>

        <div className="lg:pt-2">
          <h2 className="t-h1">
            {copy.aboutTitleLine1} <br />
            <ItalicAccent>{copy.aboutTitleAccent}</ItalicAccent>
          </h2>

          <p className="mt-6 t-body">{copy.aboutLead}</p>
          <p className="mt-6 font-serif italic text-cream-100/70 leading-relaxed">
            {copy.aboutClosingItalic}
          </p>

          <div className="mt-10 grid grid-cols-3 gap-8">
            {copy.aboutStats.map((s) => (
              <StatCard key={`${s.value}-${s.label}`} value={s.value} label={s.label} />
            ))}
          </div>

          <div className="mt-10">
            <a
              href="#menu"
              className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-[0.3em] uppercase text-gold-500 border-t border-gold-500 pt-3 transition-colors duration-600 ease-heritage hover:text-gold-400"
            >
              Пройти к казану <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}

