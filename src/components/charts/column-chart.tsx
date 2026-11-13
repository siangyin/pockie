import { formatMinorAsSgd } from "@/lib/money/sgd";

const tones = {
  ink: "bg-ink",
  amber: "bg-amber",
  bell: "bg-bell",
} as const;

export type ChartBar = {
  key: string;
  label: string;
  amountMinor: number;
  tone?: keyof typeof tones;
};

export function ColumnChart({
  bars,
  caption,
  showAmounts = false,
}: {
  bars: ChartBar[];
  caption: string;
  showAmounts?: boolean;
}) {
  const max = Math.max(...bars.map((bar) => bar.amountMinor), 1);

  return (
    <figure className="mt-4" aria-label={caption}>
      {showAmounts ? (
        <div className="mb-2 flex gap-2">
          {bars.map((bar) => (
            <p key={bar.key} className="min-w-0 flex-1 text-center text-sm font-extrabold">
              {formatMinorAsSgd(bar.amountMinor)}
            </p>
          ))}
        </div>
      ) : null}
      <div className="flex h-28 items-end gap-2">
        {bars.map((bar) => {
          const height = bar.amountMinor === 0 ? 0 : Math.max((bar.amountMinor / max) * 100, 8);
          return (
            <div key={bar.key} className="flex h-full min-w-0 flex-1 items-end">
              <div
                className={`w-full rounded-t-lg ${tones[bar.tone ?? "ink"]}`}
                style={{ height: `${height}%` }}
                title={`${bar.label} ${formatMinorAsSgd(bar.amountMinor)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        {bars.map((bar) => (
          <p key={bar.key} className="min-w-0 flex-1 text-center text-xs font-semibold leading-4">
            {bar.label}
            {showAmounts ? null : (
              <span className="mt-0.5 block font-bold">{formatMinorAsSgd(bar.amountMinor)}</span>
            )}
          </p>
        ))}
      </div>
    </figure>
  );
}
