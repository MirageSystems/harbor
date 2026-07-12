export function BalanceCard({
  amount,
  lockedAmount,
  settledAmount,
  token = "POL",
}: {
  amount: string; // wallet balance, e.g. "12,400"
  lockedAmount: string; // sum escrowed in open LCs
  settledAmount: string; // sum settled to date
  token?: string;
}) {
  return (
    <div className="relative w-80">
      {/* corner badge — remove this div if it feels like too much */}
      <div className="absolute -right-3.5 -top-3.5 h-7 w-7 rounded-full border-2 border-ink bg-accent" />

      <div className="rounded-card border-[3px] border-ink bg-surface-raised p-6 shadow-sticker">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-body text-sm font-semibold text-ink-muted">
            Available balance
          </span>
        </div>

        <div className="mb-3.5 flex items-baseline gap-2">
          <span className="font-display text-[34px] font-bold leading-[40px] text-ink">
            {amount}
          </span>
          <span className="rounded-md bg-primary px-2 py-0.5 font-mono text-sm font-medium text-white">
            {token}
          </span>
        </div>

        <p className="font-body text-[13px] leading-5 text-ink-muted">
          <span className="rounded bg-yellow px-1 font-mono font-medium text-ink">
            {lockedAmount}
          </span>{" "}
          locked in open LCs ·{" "}
          <span className="rounded bg-yellow px-1 font-mono font-medium text-ink">
            {settledAmount}
          </span>{" "}
          settled to date
        </p>
      </div>
    </div>
  );
}
