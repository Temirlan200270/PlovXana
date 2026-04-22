"use client";

import * as React from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const buttonBaseClass =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)] disabled:opacity-50 disabled:pointer-events-none";

const buttonSizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-14 px-8 text-base",
} as const;

const buttonVariantClasses = {
  primary:
    "bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--primary-gradient-end)] text-[color:var(--primary-foreground)] hover:opacity-90",
  secondary:
    "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  outline:
    "border border-[color:var(--primary)] bg-transparent text-[color:var(--primary)] hover:bg-[color:var(--primary-soft)]",
  ghost: "border border-transparent bg-transparent text-neutral-300 hover:bg-white/5 hover:text-white",
} as const;

export type ButtonVariant = keyof typeof buttonVariantClasses;
export type ButtonSize = keyof typeof buttonSizeClasses;

/** Те же классы, что у `<Button />`, для `<Link className={buttonClassName(...)} />`. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "lg",
  className?: string,
): string {
  return cn(
    buttonBaseClass,
    buttonSizeClasses[size],
    buttonVariantClasses[variant],
    className,
  );
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "lg",
      type = "button",
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClassName(variant, size, className)}
        aria-busy={loading || undefined}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            className="inline-block h-3.5 w-3.5 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden
          />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
