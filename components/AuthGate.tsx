"use client";

import { usePrivy, useLogin } from "@privy-io/react-auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { ready, authenticated } = usePrivy();
  const { login } = useLogin();

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <p className="font-body text-sm text-ink-faint">Loading…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <div className="w-full max-w-sm rounded-card border-[3px] border-ink bg-surface-raised p-10 text-center">
          <div className="mx-auto mb-4 h-10 w-10 rounded-lg border-2 border-ink bg-primary" />
          <h1 className="mb-1 font-display text-xl font-bold text-ink">Harbor</h1>
          <p className="mb-8 font-body text-sm text-ink-muted">
            Letters of credit that settle in 90 seconds.
          </p>
          <button
            onClick={login}
            className="w-full rounded-xl border-2 border-ink bg-primary px-4 py-3 font-body text-sm font-semibold text-white transition hover:bg-primary-dark"
          >
            Sign in with email
          </button>
          <p className="mt-4 font-body text-xs text-ink-faint">
            No wallet, no seed phrase — just your email.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
