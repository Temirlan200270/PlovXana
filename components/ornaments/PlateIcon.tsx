import type { CSSProperties } from "react";

export type PlateVariant =
  | "plov"
  | "kazy"
  | "samsa"
  | "tea"
  | "dessert"
  | "default";

const symbolByVariant: Record<PlateVariant, string> = {
  plov: "#plate-plov",
  kazy: "#plate-kazy",
  samsa: "#plate-samsa",
  tea: "#plate-tea",
  dessert: "#plate-dessert",
  default: "#plate-default",
};

export function PlateIcon({
  variant = "default",
  size = 48,
  label,
  className,
  style,
}: {
  variant?: PlateVariant;
  size?: number;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const href = symbolByVariant[variant];
  const ariaLabel = label?.trim() ? label.trim() : `${variant} plate`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
    >
      <use href={href} />
    </svg>
  );
}

