import { PlateIcon, type PlateVariant } from "@/components/ornaments/PlateIcon";

export function GalleryTile({
  caption,
  variant,
}: {
  caption: string;
  variant: PlateVariant;
}) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-umber-900 group">
      <div
        className="absolute inset-0 pointer-events-none bg-[url('/photo/texture-ikat.webp')] bg-repeat opacity-40 mix-blend-overlay"
        aria-hidden
      />
      <div className="absolute inset-2.5 ring-[0.5px] ring-gold-500/50" aria-hidden />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        <PlateIcon variant={variant} size={64} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-umber-950 to-transparent">
        <span className="t-micro">{caption}</span>
      </div>
    </div>
  );
}

