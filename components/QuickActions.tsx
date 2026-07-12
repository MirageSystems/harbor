"use client";

import { useState } from "react";
import { isAddress } from "viem";

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
  const [opened, setOpened] = useState(false);

  const sellerInvalid = seller.length > 0 && !isAddress(seller);

  const submit = async () => {
    await onOpenLC(seller, memo, amount);
    setFormOpen(false);
    setSeller("");
    setMemo("");
    setAmount("");
    setOpened(true);
    setTimeout(() => setOpened(false), 6000);
  };

  const inputCls =
    "w-full rounded-xl border-2 border-ink bg-surface px-3 py-2 font-body text-sm text-ink placeholder:text-ink-faint focus:outline-none";

  return (
    <div className="mt-6 flex flex-col gap-2">
      {!formOpen ? (
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center justify-between rounded-xl border-2 border-ink bg-surface-raised px-4 py-3 text-left font-body text-sm text-ink transition hover:bg-surface-sunken"
        >
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
            onChange={(e) => setSeller(e.target.value.trim())}
          />
          {sellerInvalid && (
            <p className="font-body text-xs text-accent">
              That doesn&apos;t look like a valid address.
            </p>
          )}
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
              disabled={pending || !seller || sellerInvalid || !amount}
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

      {opened && (
        <p className="rounded-xl border-2 border-ink bg-mint px-4 py-3 font-display text-sm font-bold text-white">
          Letter of credit opened — funds locked ✓
        </p>
      )}
    </div>
  );
}
