export function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-serif text-5xl font-normal bg-gradient-to-br from-gold-400 to-gold-600 bg-clip-text text-transparent">
        {value}
      </span>
      <span className="t-micro mt-1">{label}</span>
    </div>
  );
}

