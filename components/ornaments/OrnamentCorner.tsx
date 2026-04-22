import { cn } from "@/lib/utils/cn";

export function OrnamentCorner({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const placement =
    position === "tl"
      ? "left-0 top-0"
      : position === "tr"
        ? "right-0 top-0"
        : position === "bl"
          ? "left-0 bottom-0"
          : "right-0 bottom-0";

  const rotate =
    position === "tl"
      ? "rotate-0"
      : position === "tr"
        ? "rotate-90"
        : position === "br"
          ? "rotate-180"
          : "rotate-[270deg]";

  return (
    <svg
      width={56}
      height={56}
      viewBox="0 0 80 80"
      aria-hidden
      className={cn(
        "pointer-events-none absolute text-gold-500/90",
        placement,
        rotate,
        "ornament-engraved",
      )}
      style={{ transformOrigin: "0 0" }}
    >
      <use href="#kazakh-main" />
    </svg>
  );
}

