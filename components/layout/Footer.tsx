import Link from "next/link";
import type { TenantPublicConfig } from "@/lib/services/tenant.types";
import { buildYandexMapsSearchUrl } from "@/lib/utils/maps-url";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/branding";
import { OpenIndicator } from "@/components/layout/OpenIndicator";

export function Footer({ copy }: { copy: TenantPublicConfig }) {
  const mapsHref = buildYandexMapsSearchUrl(copy.contacts.addressLine);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-gold-500/20 bg-umber-950"
    >
      <div
        className="absolute inset-0 pointer-events-none bg-[url('/photo/texture-brick.jpg')] bg-repeat"
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

          <div className="mt-8 text-center">
            <Link
              href="/privacy"
              className="t-micro text-muted-400 transition-colors duration-600 ease-heritage hover:text-gold-500"
            >
              Политика конфиденциальности
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

