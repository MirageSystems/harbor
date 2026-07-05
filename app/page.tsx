import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { QuickActions } from "@/components/QuickActions";
import { LCList } from "@/components/LCList";
import { SettlementCard } from "@/components/SettlementCard";
import { SplitCompare } from "@/components/SplitCompare";
import { ClosingCard } from "@/components/ClosingCard";

export default function DashboardPage() {
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

        <div className="grid grid-cols-[320px_1fr] items-start gap-6">
          <div>
            <BalanceCard amount="12,400" previousAmount="14,800.00" settledAmount="2,400.00" />
            <QuickActions />
          </div>

          <LCList />
        </div>

        <div className="mt-10">
          <h2 className="mb-4 font-display text-base font-bold text-ink">
            Settling now — Meridian Coffee Co.
          </h2>

          <div className="relative flex justify-center rounded-card bg-surface-sunken p-14">
            <div className="absolute -top-7 right-10">
              <SplitCompare traditionalValue="10 days" harborValue="90 seconds" />
            </div>
            <SettlementCard status="settled" amount="6,400" txHash="0x8f2a91cd…c9e1b3d5f" />
          </div>
        </div>

        <ClosingCard text="10 days → 90 seconds" />
      </div>
    </main>
  );
}
