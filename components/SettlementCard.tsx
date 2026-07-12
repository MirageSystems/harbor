import { StatusPill } from "./StatusPill";

export function SettlementCard({
  amount,
  settledInSeconds,
  txHash,
  explorerUrl,
  nftId,
  nftUrl,
}: {
  amount: string;
  settledInSeconds: number;
  txHash: string;
  explorerUrl?: string | null;
  nftId: string;
  nftUrl?: string | null;
}) {
  return (
    <div className="flex w-[420px] flex-col items-center rounded-card border-[3px] border-ink bg-surface-raised p-10 text-center shadow-sticker-lg">
      <div className="mb-4 font-display text-2xl font-bold text-primary">
        Settled in {settledInSeconds}s
      </div>

      <div className="mb-6 font-display text-5xl font-bold leading-[48px] text-ink">
        {amount}
      </div>

      <div className="mb-6 flex gap-2">
        <StatusPill state="paid" label="Payment released" />
        <StatusPill state="paid" label={`Receivable #${nftId} minted`} />
      </div>

      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-body text-xs text-primary underline"
        >
          {txHash}
        </a>
      ) : (
        <div className="font-body text-xs text-ink-muted">{txHash}</div>
      )}
      {nftUrl && (
        <a
          href={nftUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 font-body text-xs text-primary underline"
        >
          view receivable #{nftId} on explorer
        </a>
      )}
    </div>
  );
}
