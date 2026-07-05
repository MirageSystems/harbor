import { StatusPill } from "./StatusPill";

type LC = {
  buyer: string;
  route: string;
  state: "opened" | "delivered" | "paid";
  amount: string;
  date: string;
};

const SAMPLE_LCS: LC[] = [
  { buyer: "Kestrel Textiles Ltd.", route: "Karachi → Rotterdam", state: "opened", amount: "8,200.00", date: "Jun 28" },
  { buyer: "Norrland Timber AB", route: "Gothenburg → Lagos", state: "delivered", amount: "14,050.00", date: "Jun 24" },
  { buyer: "Meridian Coffee Co.", route: "Medellín → Antwerp", state: "paid", amount: "6,400.00", date: "Jun 19" },
  { buyer: "Aravalli Granite Exports", route: "Jaipur → Hamburg", state: "opened", amount: "11,300.00", date: "Jun 15" },
];

export function LCList({ lcs = SAMPLE_LCS }: { lcs?: LC[] }) {
  return (
    <div className="overflow-hidden rounded-card border-[3px] border-ink bg-surface-raised shadow-sticker">
      <div className="flex items-center justify-between border-b-[3px] border-ink px-6 py-5">
        <span className="font-display text-base font-bold text-ink">
          Active letters of credit
        </span>
        <span className="font-body text-[13px] text-ink-faint">{lcs.length} open</span>
      </div>

      {lcs.map((lc, i) => (
        <div
          key={lc.buyer}
          className={`grid grid-cols-[1fr_140px_120px_100px] items-center px-6 py-4 ${
            i < lcs.length - 1 ? "border-b-2 border-ink/10" : ""
          }`}
        >
          <div>
            <div className="font-body text-sm font-semibold text-ink">{lc.buyer}</div>
            <div className="font-body text-xs text-ink-faint">{lc.route}</div>
          </div>
          <div>
            <StatusPill state={lc.state} />
          </div>
          <div className="text-right font-mono text-sm text-ink">{lc.amount}</div>
          <div className="text-right font-body text-sm text-ink-muted">{lc.date}</div>
        </div>
      ))}
    </div>
  );
}
