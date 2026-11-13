import { shareLabel, type CategorySpend } from "@/lib/reports/summary";
import { formatMinorAsSgd } from "@/lib/money/sgd";

export function CategoryBars({ items, totalMinor }: { items: CategorySpend[]; totalMinor: number }) {
  return (
    <ul className="mt-3 grid gap-3">
      {items.map((category) => (
        <li key={category.category} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold">{category.category}</p>
            <p className="text-right font-extrabold">{formatMinorAsSgd(category.amountMinor)}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{shareLabel(category.amountMinor, totalMinor)} of spending</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-soft" aria-hidden="true">
            <div
              className="h-full bg-ink"
              style={{
                width: `${totalMinor <= 0 ? 0 : Math.min(100, Math.max((category.amountMinor / totalMinor) * 100, 2))}%`,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
