import Link from "next/link";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { buildYandexMapsSearchUrl } from "@/lib/utils/maps-url";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/branding";
import { OpenIndicator } from "@/components/layout/OpenIndicator";
import { getLegalInfo } from "@/lib/legal";

export function Footer({ copy }: { copy: TenantPublicConfig }) {
  const mapsHref = buildYandexMapsSearchUrl(copy.contacts.addressLine);
  const legal = getLegalInfo();

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-gold-500/20 bg-umber-950"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[url('/photo/texture-brick.webp')] bg-repeat"
        style={{ opacity: 0.6, mixBlendMode: "normal" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none bg-film-grain"
        style={{ opacity: 0.06 }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-16 md:px-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="t-caps">АДРЕС</div>
            <p className="mt-4 t-body text-cream-100/80">{copy.contacts.addressLine}</p>
            <div className="mt-4">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-[0.3em] uppercase text-gold-500 transition-colors duration-600 ease-heritage hover:text-gold-400"
              >
                Открыть в картах <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          <div>
            <div className="t-caps">ЧАСЫ</div>
            <p className="mt-4 t-body text-cream-100/80">{copy.contacts.hoursLine}</p>
            <div className="mt-3">
              <OpenIndicator hoursLine={copy.contacts.hoursLine} />
            </div>
            <p className="mt-4 t-micro">{copy.contacts.kazansLine}</p>
          </div>

          <div>
            <div className="t-caps">КОНТАКТ</div>
            <div className="mt-4 space-y-3">
              <a
                href={`tel:${copy.contacts.bookingPhoneE164}`}
                className="block font-serif text-xl text-cream-100 transition-colors duration-600 ease-heritage hover:text-gold-500"
              >
                {copy.contacts.bookingPhoneDisplay}
              </a>

              {copy.contacts.publicEmail ? (
                <a
                  href={`mailto:${copy.contacts.publicEmail}`}
                  className="block t-body text-cream-100/80 transition-colors duration-600 ease-heritage hover:text-gold-500"
                >
                  {copy.contacts.publicEmail}
                </a>
              ) : null}

              {legal.phoneDisplay ? (
                <div className="t-micro text-muted-400">
                  {legal.city} · {legal.country}
                </div>
              ) : (
                <div className="t-micro text-muted-400">
                  {legal.city} · {legal.country}
                </div>
              )}

              <a
                href={copy.contacts.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 font-sans text-xs font-medium tracking-[0.3em] uppercase text-gold-500 transition-colors duration-600 ease-heritage hover:text-gold-400"
              >
                {copy.footerInstagramLabel} <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-gold-500/20 pt-10">
          <div className="flex flex-col gap-6 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div className="t-micro text-muted-400">
              © {new Date().getFullYear()} · {BRAND_NAME} · {BRAND_TAGLINE} ·{" "}
              <span className="italic text-cream-100/70">{copy.footerClosingItalic}</span>
            </div>
            <div className="t-micro text-muted-400">
              INSTAGRAM · TIKTOK · 2ГИС
            </div>
            <div className="t-micro text-muted-400">СДЕЛАНО В СТЕПИ</div>
          </div>

          <div className="mt-10 grid gap-6 text-center md:grid-cols-3 md:text-left">
            <div className="t-micro text-muted-400">
              <div className="text-cream-100/80">{legal.brandName}</div>
              <div className="mt-1">
                {legal.operatorNameRu}
                {legal.iinBin ? ` · БИН/ИИН: ${legal.iinBin}` : null}
              </div>
              <div className="mt-1">{legal.addressLine}</div>
              <div className="mt-1">
                <a
                  href={`mailto:${legal.publicEmail}`}
                  className="transition-colors duration-600 ease-heritage hover:text-gold-500"
                >
                  {legal.publicEmail}
                </a>
              </div>
              <div className="mt-3 text-cream-100/70">
                This service is operated by {legal.operatorNameEn}.
              </div>
            </div>

            <div className="t-micro text-muted-400 md:text-center">
              <Link
                href="/privacy"
                className="transition-colors duration-600 ease-heritage hover:text-gold-500"
              >
                Privacy Policy
              </Link>
              <span className="mx-2 text-muted-400/70">|</span>
              <Link
                href="/terms"
                className="transition-colors duration-600 ease-heritage hover:text-gold-500"
              >
                Terms of Service
              </Link>
            </div>

            <div className="t-micro text-muted-400 md:text-right">
              <div className="text-cream-100/80">Website</div>
              <div className="mt-1">{legal.domain}</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

