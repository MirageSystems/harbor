"use client";

import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { QuickActions } from "@/components/QuickActions";
import { LCList } from "@/components/LCList";
import { SettlementCard } from "@/components/SettlementCard";
import { SplitCompare } from "@/components/SplitCompare";
import { ClosingCard } from "@/components/ClosingCard";
import { useHarbor } from "@/hooks/useHarbor";
import {
  explorerTokenUrl,
  explorerTxUrl,
  formatPol,
  nativeSymbol,
  shortHex,
} from "@/lib/harbor";

export default function DashboardPage() {
  const {
    address,
    lcs,
    balance,
    lastSettledTx,
    pending,
    loaded,
    error,
    errorDetail,
    openLC,
    markDelivered,
  } = useHarbor();

  const settled = lcs.filter((lc) => lc.status === "settled");
  const latestSettled = settled.at(-1);
  const settledTotal = settled.reduce((s, lc) => s + lc.amount, 0n);
  const lockedTotal = lcs
    .filter((lc) => lc.status === "open")
    .reduce((s, lc) => s + lc.amount, 0n);
  const settledIn = latestSettled
    ? latestSettled.settledAt - latestSettled.openedAt
    : 0;

  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <div className="mx-auto max-w-6xl px-10 py-10">
        <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Overview
        </p>
        <h1 className="mb-8 font-display text-2xl font-bold text-ink">
          Good morning — here&apos;s where things stand
        </h1>

        {error && (
          <div className="mb-4 rounded-xl border-2 border-ink bg-yellow px-4 py-2 font-body text-xs text-ink">
            {error}
            {errorDetail && (
              <details className="mt-1">
                <summary className="cursor-pointer text-ink-muted">details</summary>
                <p className="mt-1 break-all font-mono text-[10px] text-ink-muted">
                  {errorDetail}
                </p>
              </details>
            )}
          </div>
        )}

        <div className="grid grid-cols-[320px_1fr] items-start gap-6">
          <div>
            <BalanceCard
              amount={balance !== null ? formatPol(balance) : "—"}
              lockedAmount={formatPol(lockedTotal)}
              settledAmount={formatPol(settledTotal)}
              token={nativeSymbol}
            />
            <QuickActions pending={pending} onOpenLC={openLC} />
          </div>

          <LCList
            lcs={lcs}
            address={address}
            pending={pending}
            loaded={loaded}
            onMarkDelivered={markDelivered}
          />
        </div>

        {latestSettled && lastSettledTx && (
          <div className="mt-10">
            <h2 className="mb-4 font-display text-base font-bold text-ink">
              Settled — {latestSettled.memo || `LC #${latestSettled.id}`}
            </h2>

            <div className="relative flex justify-center rounded-card bg-surface-sunken p-14">
              <div className="absolute -top-7 right-10">
                <SplitCompare
                  traditionalValue="10 days"
                  harborValue={`${settledIn} seconds`}
                />
              </div>
              <SettlementCard
                amount={formatPol(latestSettled.amount)}
                settledInSeconds={settledIn}
                txHash={shortHex(lastSettledTx, 10, 8)}
                explorerUrl={explorerTxUrl(lastSettledTx)}
                nftId={latestSettled.id.toString()}
                nftUrl={explorerTokenUrl(latestSettled.id)}
              />
            </div>
          </div>
        )}

        <ClosingCard text="10 days → 90 seconds" />
      </div>
    </main>
  );
}
