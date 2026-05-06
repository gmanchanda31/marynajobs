import { STATUS_LABELS, type Status } from "@/lib/schema";

const styles: Record<Status, string> = {
  found: "bg-slate-100 text-slate-700 border-slate-200",
  applied: "bg-blue-50 text-blue-700 border-blue-200",
  in_test: "bg-amber-50 text-amber-800 border-amber-200",
  active: "bg-emerald-50 text-emerald-800 border-emerald-200",
  closed: "bg-rose-50 text-rose-700 border-rose-200",
  withdrawn: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function StatusPill({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center text-xs font-medium border rounded-full px-2 py-0.5 ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
