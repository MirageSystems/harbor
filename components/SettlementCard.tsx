import { StatusPill } from "./StatusPill";

export function SettlementCard({
  status,
  amount,
  txHash,
}: {
  status: "settling" | "settled";
  amount: string; // e.g. "6,400"
  txHash: string; // e.g. "0x8f2a91cd…c9e1b3d5f"
}) {
  const isSettled = status === "settled";

  return (
    <div className="flex w-[420px] flex-col items-center rounded-card border-[3px] border-ink bg-surface-raised p-10 text-center shadow-sticker-lg">
      <div
        className={`mb-4 font-display text-2xl font-bold ${
          isSettled ? "text-primary" : "text-ink-faint"
        }`}
      >
        {isSettled ? "Settled" : "Settling…"}
      </div>

      <div className="mb-6 font-display text-5xl font-bold leading-[48px] text-ink">
        {amount}
      </div>

      <div className="mb-6 flex gap-2">
        <StatusPill state="paid" label="Payment released" />
        <StatusPill state="paid" label="Receivable minted" />
      </div>

      <div className="font-body text-xs text-ink-muted underline">{txHash}</div>
    </div>
  );
}
