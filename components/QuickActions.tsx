const ACTIONS = [
  "Open a new letter of credit",
  "Add a counterparty",
  "View settlement history",
];

export function QuickActions() {
  return (
    <div className="mt-6 flex flex-col gap-2">
      {ACTIONS.map((label) => (
        <button
          key={label}
          className="flex items-center justify-between rounded-xl border-2 border-ink bg-surface-raised px-4 py-3 text-left font-body text-sm text-ink transition hover:bg-surface-sunken"
        >
          {label}
          <span className="text-ink-faint">→</span>
        </button>
      ))}
    </div>
  );
}
