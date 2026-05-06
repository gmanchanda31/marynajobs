import Link from "next/link";
import { STATUSES, STATUS_LABELS, type Status } from "@/lib/schema";

const dotColors: Record<Status, string> = {
  found: "bg-slate-400",
  applied: "bg-blue-500",
  in_test: "bg-amber-500",
  active: "bg-emerald-500",
  closed: "bg-rose-500",
  withdrawn: "bg-zinc-400",
};

export function PipelineSummary({
  counts,
  active,
}: {
  counts: Record<Status, number>;
  active: Status | "all";
}) {
  const total = STATUSES.reduce((s, k) => s + (counts[k] ?? 0), 0);
  return (
    <div className="flex flex-wrap gap-2">
      <FilterPill href="/" label="All" count={total} active={active === "all"} dot="bg-[var(--color-cocoa)]" />
      {STATUSES.map((s) => (
        <FilterPill
          key={s}
          href={`/?status=${s}`}
          label={STATUS_LABELS[s]}
          count={counts[s] ?? 0}
          active={active === s}
          dot={dotColors[s]}
        />
      ))}
    </div>
  );
}

function FilterPill({
  href,
  label,
  count,
  active,
  dot,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
  dot: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "bg-[var(--color-cocoa)] text-white border-[var(--color-cocoa)]"
          : "bg-white border-[#e8dec1] text-[var(--color-ink)] hover:border-[var(--color-cocoa)]"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${active ? "bg-white" : dot}`} />
      <span className="font-medium">{label}</span>
      <span className={active ? "text-white/80" : "text-[var(--color-ink-muted)]"}>{count}</span>
    </Link>
  );
}
