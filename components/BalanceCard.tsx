import { StatusPill } from "./StatusPill";

export function BalanceCard({
  amount,
  previousAmount,
  settledAmount,
  token = "POL",
}: {
  amount: string; // e.g. "12,400"
  previousAmount: string; // e.g. "14,800.00"
  settledAmount: string; // e.g. "2,400.00"
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
          <StatusPill state="paid" />
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
          Down from{" "}
          <span className="rounded bg-yellow px-1 font-mono font-medium text-ink">
            {previousAmount}
          </span>{" "}
          after{" "}
          <span className="rounded bg-yellow px-1 font-mono font-medium text-ink">
            {settledAmount}
          </span>{" "}
          settled
        </p>
      </div>
    </div>
  );
}
