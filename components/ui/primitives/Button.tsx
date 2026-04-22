"use client";

import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ButtonSize = "sm" | "md" | "lg";
export type ButtonVariant = "primary" | "secondary" | "ghost";

type CommonProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
};

type ButtonElementProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    variant?: ButtonVariant;
  };

type AnchorElementProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    variant?: ButtonVariant;
  };

export type ButtonProps = ButtonElementProps | AnchorElementProps;

const sizeClass: Record<ButtonSize, string> = {
  sm: "px-8 py-3 text-xs",
  md: "px-10 py-4 text-xs",
  lg: "px-10 py-4 text-xs",
};

const baseClass =
  "group relative inline-flex items-center justify-center select-none whitespace-nowrap rounded-none font-sans font-medium tracking-[0.3em] uppercase transition-all duration-600 ease-heritage active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500 disabled:opacity-50 disabled:pointer-events-none";

const variantClass: Record<ButtonVariant, string> = {
  primary:
    "bg-gold-500 text-umber-950 shadow-lift-sm hover:bg-gold-400 hover:shadow-lift-md hover:shadow-ember-glow",
  secondary:
    "bg-transparent text-gold-500 ring-1 ring-gold-500 hover:bg-gold-500/10 hover:text-gold-400",
  ghost:
    "bg-transparent text-gold-500 border-t border-gold-500 pt-3 hover:text-gold-400",
};

export function Button({
  className,
  size = "md",
  variant = "secondary",
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClass, sizeClass[size], variantClass[variant], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} className={classes} {...anchorProps}>
        {variant === "primary" ? (
          <span
            className="pointer-events-none absolute inset-[2px] ring-[0.5px] ring-umber-950/40"
            aria-hidden
          />
        ) : null}
        <span className="relative">{children}</span>
      </a>
    );
  }

  const { type = "button", ...buttonProps } = props;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {variant === "primary" ? (
        <span
          className="pointer-events-none absolute inset-[2px] ring-[0.5px] ring-umber-950/40"
          aria-hidden
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

