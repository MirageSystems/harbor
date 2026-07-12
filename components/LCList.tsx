"use client";

import { useEffect, useState } from "react";
import { StatusPill } from "./StatusPill";
import { formatElapsed, formatPol, shortHex, type LC, type LCStatus } from "@/lib/harbor";

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
  loaded,
  onMarkDelivered,
}: {
  lcs: LC[];
  address?: string;
  pending: boolean;
  loaded: boolean;
  onMarkDelivered: (id: bigint) => void;
}) {
  // 1s tick so open LCs show live elapsed time since openedAt.
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  useEffect(() => {
    const t = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const openCount = lcs.filter((lc) => lc.status === "open").length;

  return (
    <div className="overflow-hidden rounded-card border-[3px] border-ink bg-surface-raised shadow-sticker">
      <div className="flex items-center justify-between border-b-[3px] border-ink px-6 py-5">
        <span className="font-display text-base font-bold text-ink">
          Active letters of credit
        </span>
        <span className="font-body text-[13px] text-ink-faint">{openCount} open</span>
      </div>

      {!loaded && (
        <p className="px-6 py-8 text-center font-body text-sm text-ink-faint">Loading…</p>
      )}
      {loaded && lcs.length === 0 && (
        <p className="px-6 py-8 text-center font-body text-sm text-ink-faint">
          No letters of credit yet — open one to get started.
        </p>
      )}

      {lcs.map((lc, i) => {
        const isSeller = address?.toLowerCase() === lc.seller.toLowerCase();
        const isBuyer = address?.toLowerCase() === lc.buyer.toLowerCase();
        const isOpen = lc.status === "open";
        return (
          <div
            key={lc.id.toString()}
            className={`grid grid-cols-[1fr_150px_130px_150px] items-center px-6 py-4 ${
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
              {isOpen && isBuyer && (
                <div className="mt-0.5 font-body text-xs text-ink-muted">
                  waiting for seller to confirm delivery
                </div>
              )}
              {isOpen && isSeller && (
                <div className="mt-0.5 font-body text-xs text-ink-muted">
                  you&apos;re the seller — confirm delivery to get paid
                </div>
              )}
            </div>
            <div>
              <StatusPill {...STATUS_PILL[lc.status]} />
            </div>
            <div className="text-right font-mono text-sm text-ink">
              {formatPol(lc.amount)}
            </div>
            <div className="text-right">
              {isOpen && isSeller ? (
                <button
                  onClick={() => onMarkDelivered(lc.id)}
                  disabled={pending}
                  className="rounded-xl border-2 border-ink bg-mint px-3 py-1.5 font-display text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                >
                  Mark delivered
                </button>
              ) : isOpen ? (
                <span className="font-mono text-sm text-ink-muted">
                  open {formatElapsed(now - lc.openedAt)}
                </span>
              ) : lc.status === "settled" ? (
                <span className="font-mono text-sm text-mint">
                  settled in {lc.settledAt - lc.openedAt}s
                </span>
              ) : (
                <span className="font-body text-sm text-ink-muted">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
