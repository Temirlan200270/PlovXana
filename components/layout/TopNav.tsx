"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { BRAND_NAME } from "@/lib/branding";
import { Button } from "@/components/ui/primitives/Button";

const NAV_LABELS = {
  menu: "Меню",
  about: "О нас",
  gallery: "Атмосфера",
  reserve: "Бронь",
  contact: "Контакты",
  cta: "Забронировать стол",
  burgerOpen: "Меню",
  burgerClose: "Закрыть",
} as const;

export function TopNav({ menuHref }: { menuHref: string }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gold-500/30 bg-umber-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 md:px-16">
        <Link
          href="/"
          className="font-sans text-xs font-medium tracking-[0.35em] uppercase text-cream-100/90 transition-colors duration-600 ease-heritage hover:text-gold-500"
        >
          {BRAND_NAME}
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <NavLink href={menuHref}>{NAV_LABELS.menu}</NavLink>
          <NavLink href="#about">{NAV_LABELS.about}</NavLink>
          <NavLink href="#gallery">{NAV_LABELS.gallery}</NavLink>
          <NavLink href="#reserve">{NAV_LABELS.reserve}</NavLink>
          <NavLink href="#contact">{NAV_LABELS.contact}</NavLink>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Button href="#reserve" variant="primary" size="sm">
            {NAV_LABELS.cta}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-none ring-1 ring-gold-500/40 px-4 py-2 text-gold-500 md:hidden"
          aria-label={open ? NAV_LABELS.burgerClose : NAV_LABELS.burgerOpen}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-sans text-xs font-medium tracking-[0.35em] uppercase">
            {open ? NAV_LABELS.burgerClose : NAV_LABELS.burgerOpen}
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-gold-500/20 bg-umber-950/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-[1280px] px-6 py-4">
            <nav className="flex flex-col gap-3">
              <MobileNavLink href={menuHref} onClick={() => setOpen(false)}>
                {NAV_LABELS.menu}
              </MobileNavLink>
              <MobileNavLink href="#about" onClick={() => setOpen(false)}>
                {NAV_LABELS.about}
              </MobileNavLink>
              <MobileNavLink href="#gallery" onClick={() => setOpen(false)}>
                {NAV_LABELS.gallery}
              </MobileNavLink>
              <MobileNavLink href="#reserve" onClick={() => setOpen(false)}>
                {NAV_LABELS.reserve}
              </MobileNavLink>
              <MobileNavLink href="#contact" onClick={() => setOpen(false)}>
                {NAV_LABELS.contact}
              </MobileNavLink>
              <div className="pt-2">
                <Button
                  href="#reserve"
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {NAV_LABELS.cta}
                </Button>
              </div>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="font-sans text-[10px] font-medium tracking-[0.25em] uppercase text-cream-100/75 transition-colors duration-600 ease-heritage hover:text-gold-500"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "px-3 py-2 font-sans text-xs font-medium tracking-[0.3em] uppercase",
        "text-cream-100/90 ring-1 ring-gold-500/20 bg-umber-900/40",
        "transition-colors duration-600 ease-heritage hover:text-gold-500",
      )}
    >
      {children}
    </Link>
  );
}
