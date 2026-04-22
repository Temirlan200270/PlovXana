/** Heritage skeleton: дышащая «лампа» вместо white-on-white заглушки. */
export function MenuSkeleton() {
  return (
    <div className="space-y-12" aria-hidden>
      <div className="space-y-4">
        <div className="h-3 w-24 bg-gold-500/30 lamp-breathe" />
        <div className="h-12 w-2/3 bg-cream-100/10 lamp-breathe" />
        <div className="h-4 w-1/2 bg-cream-100/5 lamp-breathe" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-10 w-28 shrink-0 bg-umber-900 ring-1 ring-gold-500/20 lamp-breathe"
          />
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="relative bg-umber-900 ring-1 ring-gold-500/40 shadow-lift-sm h-[360px] lamp-breathe"
          />
        ))}
      </div>
    </div>
  );
}
