"use client";

import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { QuickActions } from "@/components/QuickActions";
import { LCList } from "@/components/LCList";
import { SettlementCard } from "@/components/SettlementCard";
import { SplitCompare } from "@/components/SplitCompare";
import { ClosingCard } from "@/components/ClosingCard";
import { useHarbor } from "@/hooks/useHarbor";
import { explorerTxUrl, formatPol, nativeSymbol, shortHex } from "@/lib/harbor";

export default function DashboardPage() {
  const { address, lcs, balance, lastSettledTx, pending, error, openLC, markDelivered } =
    useHarbor();

  const settled = lcs.filter((lc) => lc.status === "settled");
  const latestSettled = settled.at(-1);
  const settledTotal = settled.reduce((s, lc) => s + lc.amount, 0n);

  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <div className="mx-auto max-w-6xl px-10 py-10">
        <p className="mb-1 font-body text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Overview
        </p>
        <h1 className="mb-2 font-display text-2xl font-bold text-ink">
          Good morning — here&apos;s where things stand
        </h1>
        {address && (
          <p className="mb-8 font-mono text-xs text-ink-faint">
            wallet {shortHex(address)}
          </p>
        )}

        {error && (
          <p className="mb-4 rounded-xl border-2 border-ink bg-yellow px-4 py-2 font-body text-xs text-ink">
            {error}
          </p>
        )}

        <div className="grid grid-cols-[320px_1fr] items-start gap-6">
          <div>
            <BalanceCard
              amount={balance !== null ? formatPol(balance) : "—"}
              previousAmount={
                balance !== null ? formatPol(balance + settledTotal) : "—"
              }
              settledAmount={formatPol(settledTotal)}
              token={nativeSymbol}
            />
            <QuickActions pending={pending} onOpenLC={openLC} />
          </div>

          <LCList
            lcs={lcs}
            address={address}
            pending={pending}
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
                <SplitCompare traditionalValue="10 days" harborValue="90 seconds" />
              </div>
              <SettlementCard
                status="settled"
                amount={formatPol(latestSettled.amount)}
                txHash={shortHex(lastSettledTx, 10, 8)}
                explorerUrl={explorerTxUrl(lastSettledTx)}
              />
            </div>
          </div>
        )}

        <ClosingCard text="10 days → 90 seconds" />
      </div>
    </main>
  );
}
