type PillState = "opened" | "delivered" | "paid";

const STATE_STYLES: Record<PillState, string> = {
  opened: "bg-accent",
  delivered: "bg-primary",
  paid: "bg-mint",
};

const STATE_LABELS: Record<PillState, string> = {
  opened: "Opened",
  delivered: "Delivered",
  paid: "Paid",
};

export function StatusPill({
  state,
  label,
}: {
  state: PillState;
  label?: string; // override text, e.g. "Payment released"
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill border-2 border-ink
                  px-3.5 py-1.5 font-display text-[13px] font-bold text-white
                  ${STATE_STYLES[state]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-white" />
      {label ?? STATE_LABELS[state]}
    </span>
  );
}
