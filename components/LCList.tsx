"use client";

import { StatusPill } from "./StatusPill";
import { formatPol, shortHex, type LC, type LCStatus } from "@/lib/harbor";

const STATUS_PILL: Record<LCStatus, { state: "opened" | "paid"; label?: string }> = {
  open: { state: "opened" },
  settled: { state: "paid" },
  cancelled: { state: "opened", label: "Cancelled" },
  none: { state: "opened" },
};

export function LCList({
  lcs,
  address,
  pending,
  onMarkDelivered,
}: {
  lcs: LC[];
  address?: string;
  pending: boolean;
  onMarkDelivered: (id: bigint) => void;
}) {
  const openCount = lcs.filter((lc) => lc.status === "open").length;

  return (
    <div className="overflow-hidden rounded-card border-[3px] border-ink bg-surface-raised shadow-sticker">
      <div className="flex items-center justify-between border-b-[3px] border-ink px-6 py-5">
        <span className="font-display text-base font-bold text-ink">
          Active letters of credit
        </span>
        <span className="font-body text-[13px] text-ink-faint">{openCount} open</span>
      </div>

      {lcs.length === 0 && (
        <p className="px-6 py-8 text-center font-body text-sm text-ink-faint">
          No letters of credit yet — open one to get started.
        </p>
      )}

      {lcs.map((lc, i) => {
        const isSeller = address?.toLowerCase() === lc.seller.toLowerCase();
        const isBuyer = address?.toLowerCase() === lc.buyer.toLowerCase();
        return (
          <div
            key={lc.id.toString()}
            className={`grid grid-cols-[1fr_150px_130px_130px] items-center px-6 py-4 ${
              i < lcs.length - 1 ? "border-b-2 border-ink/10" : ""
            }`}
          >
            <div>
              <div className="font-body text-sm font-semibold text-ink">
                {lc.memo || `LC #${lc.id}`}
              </div>
              <div className="font-body text-xs text-ink-faint">
                {isBuyer ? "you" : shortHex(lc.buyer)} →{" "}
                {isSeller ? "you" : shortHex(lc.seller)}
              </div>
            </div>
            <div>
              <StatusPill {...STATUS_PILL[lc.status]} />
            </div>
            <div className="text-right font-mono text-sm text-ink">
              {formatPol(lc.amount)}
            </div>
            <div className="text-right">
              {lc.status === "open" && isSeller ? (
                <button
                  onClick={() => onMarkDelivered(lc.id)}
                  disabled={pending}
                  className="rounded-xl border-2 border-ink bg-mint px-3 py-1.5 font-display text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Mark delivered
                </button>
              ) : (
                <span className="font-body text-sm text-ink-muted">
                  {new Date(lc.openedAt * 1000).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
