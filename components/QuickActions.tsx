"use client";

import { useState } from "react";

export function QuickActions({
  pending,
  onOpenLC,
}: {
  pending: boolean;
  onOpenLC: (seller: string, memo: string, amountPol: string) => Promise<unknown>;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [seller, setSeller] = useState("");
  const [memo, setMemo] = useState("");
  const [amount, setAmount] = useState("");

  const submit = async () => {
    await onOpenLC(seller, memo, amount);
    setFormOpen(false);
    setSeller("");
    setMemo("");
    setAmount("");
  };

  const inputCls =
    "w-full rounded-xl border-2 border-ink bg-surface px-3 py-2 font-body text-sm text-ink placeholder:text-ink-faint focus:outline-none";
  const actionCls =
    "flex items-center justify-between rounded-xl border-2 border-ink bg-surface-raised px-4 py-3 text-left font-body text-sm text-ink transition hover:bg-surface-sunken";

  return (
    <div className="mt-6 flex flex-col gap-2">
      {!formOpen ? (
        <button onClick={() => setFormOpen(true)} className={actionCls}>
          Open a new letter of credit
          <span className="text-ink-faint">→</span>
        </button>
      ) : (
        <div className="flex flex-col gap-2 rounded-xl border-2 border-ink bg-surface-raised p-4">
          <span className="font-display text-sm font-bold text-ink">
            New letter of credit
          </span>
          <input
            className={inputCls}
            placeholder="Seller address (0x…)"
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Memo, e.g. PO-2026-0710"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
          <input
            className={inputCls}
            placeholder="Amount (POL)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="mt-1 flex gap-2">
            <button
              onClick={submit}
              disabled={pending || !seller || !amount}
              className="flex-1 rounded-xl border-2 border-ink bg-primary px-3 py-2 font-display text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
            >
              {pending ? "Locking funds…" : "Open & lock funds"}
            </button>
            <button
              onClick={() => setFormOpen(false)}
              className="rounded-xl border-2 border-ink bg-surface-sunken px-3 py-2 font-body text-sm text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {["Add a counterparty", "View settlement history"].map((label) => (
        <button key={label} className={actionCls}>
          {label}
          <span className="text-ink-faint">→</span>
        </button>
      ))}
    </div>
  );
}
