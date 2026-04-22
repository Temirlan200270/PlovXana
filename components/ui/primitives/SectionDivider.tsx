export function SectionDivider({ count = 1 }: { count?: 1 | 3 | 5 }) {
  const size = count === 1 ? 48 : 32;
  const mid = Math.floor(count / 2);

  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-px max-w-[30%] flex-1 bg-gold-500/30" />
      <div className="flex items-center gap-2 px-6">
        {Array.from({ length: count }).map((_, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            aria-hidden
            className="ornament-engraved"
            style={{ opacity: i === mid ? 1 : 0.6 }}
          >
            <use href="#kazakh-main" />
          </svg>
        ))}
      </div>
      <div className="h-px max-w-[30%] flex-1 bg-gold-500/30" />
    </div>
  );
}

