"use client";

import { useState } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { chainLabel, shortHex } from "@/lib/harbor";

export function Header() {
  const { user, logout } = usePrivy();
  const { wallets } = useWallets();
  const email = user?.email?.address;
  const address = wallets[0]?.address;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header className="flex items-center justify-between border-b-[3px] border-ink bg-surface-raised px-10 py-4">
      <div className="flex items-center gap-2.5">
        <div className="relative h-7 w-7 rounded-lg border-2 border-ink bg-primary" />
        <span className="font-display text-base font-bold text-ink">Harbor</span>
        <span className="ml-3 rounded-pill border-2 border-ink bg-yellow px-2.5 py-0.5 font-display text-[11px] font-bold text-ink">
          {chainLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {email && <span className="font-body text-sm text-ink-muted">{email}</span>}
        {address && (
          <button
            onClick={copy}
            title="Copy wallet address"
            className="rounded-xl border-2 border-ink bg-surface px-3 py-1.5 font-mono text-xs text-ink transition hover:bg-surface-sunken"
          >
            {copied ? "copied ✓" : shortHex(address)}
          </button>
        )}
        <button
          onClick={logout}
          className="rounded-xl border-2 border-ink bg-surface-sunken px-3 py-1.5 font-body text-xs font-semibold text-ink transition hover:bg-surface"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
