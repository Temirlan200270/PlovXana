"use client";

export function LampGlow({
  x,
  y,
  size = 60,
  className,
}: {
  x: string;
  y: string;
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none ${className ?? ""}`}
      style={{ left: x, top: y }}
      aria-hidden
    >
      <div
        className="lamp-breathe rounded-full"
        style={{
          width: size * 2,
          height: size * 2,
          background:
            "radial-gradient(circle, rgba(232,168,79,0.25) 0%, rgba(232,168,79,0) 70%)",
          filter: "blur(20px)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 lamp-breathe -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size / 1.5,
          height: size / 1.5,
          background:
            "radial-gradient(circle, rgba(232,168,79,0.5) 0%, rgba(232,168,79,0) 80%)",
        }}
      />
    </div>
  );
}

