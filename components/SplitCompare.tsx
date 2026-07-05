export function SplitCompare({
  traditionalLabel = "Traditional",
  traditionalValue,
  harborLabel = "Harbor",
  harborValue,
}: {
  traditionalLabel?: string;
  traditionalValue: string; // e.g. "10 days"
  harborLabel?: string;
  harborValue: string; // e.g. "90 seconds"
}) {
  return (
    <div className="flex w-[300px] overflow-hidden rounded-card border-[3px] border-ink bg-surface-raised shadow-sticker">
      <div className="flex flex-1 flex-col items-center gap-1.5 p-3.5 text-center">
        <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-ink-faint">
          {traditionalLabel}
        </span>
        <span className="font-mono text-base text-ink">{traditionalValue}</span>
      </div>

      <div className="w-0.5 self-stretch bg-ink-faint" />

      <div className="flex flex-1 flex-col items-center gap-1.5 p-3.5 text-center">
        <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-primary">
          {harborLabel}
        </span>
        <span className="font-mono text-base text-ink">{harborValue}</span>
      </div>
    </div>
  );
}
