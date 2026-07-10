"use client";

import { usePrivy } from "@privy-io/react-auth";

export function Header() {
  const { user, logout } = usePrivy();
  const email = user?.email?.address;

  return (
    <header className="flex items-center justify-between border-b-[3px] border-ink bg-surface-raised px-10 py-4">
      <div className="flex items-center gap-2.5">
        <div className="relative h-7 w-7 rounded-lg border-2 border-ink bg-primary" />
        <span className="font-display text-base font-bold text-ink">Harbor</span>
      </div>

      <nav className="flex gap-8 font-body text-sm text-ink-muted">
        <a href="#" className="font-semibold text-ink">
          Dashboard
        </a>
        <a href="#">Letters of Credit</a>
        <a href="#">Settlements</a>
        <a href="#">Counterparties</a>
      </nav>

      <div className="flex items-center gap-3">
        {email && (
          <span className="font-body text-sm text-ink-muted">{email}</span>
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
