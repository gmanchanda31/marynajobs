"use client";

import { useState } from "react";
import { StatusPill } from "./status-pill";
import { STATUSES, STATUS_LABELS, TIER_LABELS, type Job, type Status } from "@/lib/schema";
import { updateJob, deleteJob } from "@/lib/actions";

function formatRelative(d: Date | null | undefined): string {
  if (!d) return "—";
  const date = new Date(d);
  const ms = Date.now() - date.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toISOString().slice(0, 10);
}

function fmtDateInput(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function JobRow({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);

  const update = async (formData: FormData) => {
    await updateJob(job.id, formData);
    setOpen(false);
  };

  return (
    <div className="border-b border-[#ece2c8] last:border-b-0">
      <div
        className="grid grid-cols-12 gap-3 items-center px-4 py-3 cursor-pointer hover:bg-[#faf6ec] transition"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="col-span-3 min-w-0">
          <div className="font-medium text-sm truncate">{job.platform}</div>
          <div className="text-xs text-[var(--color-ink-muted)] truncate">{TIER_LABELS[job.tier as keyof typeof TIER_LABELS]}</div>
        </div>
        <div className="col-span-3 min-w-0">
          <div className="text-sm truncate">{job.role}</div>
        </div>
        <div className="col-span-2">
          <StatusPill status={job.status as Status} />
        </div>
        <div className="col-span-2 text-sm text-[var(--color-ink-muted)] truncate">
          {job.payRate ?? "—"}
        </div>
        <div className="col-span-1 text-xs text-[var(--color-ink-muted)] text-right">
          {formatRelative(job.updatedAt)}
        </div>
        <div className="col-span-1 text-right">
          {job.url ? (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[var(--color-cocoa)] hover:underline"
            >
              link ↗
            </a>
          ) : (
            <span className="text-xs text-[var(--color-ink-muted)]">—</span>
          )}
        </div>
      </div>

      {open ? (
        <form action={update} className="grid grid-cols-2 gap-4 px-4 pb-4 pt-1 bg-[#faf6ec]">
          <Field label="Status">
            <select name="status" defaultValue={job.status} className={inputCls}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Pay rate">
            <input name="payRate" defaultValue={job.payRate ?? ""} className={inputCls} placeholder="$25/hr" />
          </Field>
          <Field label="Job URL">
            <input name="url" defaultValue={job.url ?? ""} className={inputCls} placeholder="https://..." />
          </Field>
          <Field label="Payment method">
            <input name="paymentMethod" defaultValue={job.paymentMethod ?? ""} className={inputCls} placeholder="Wise / PayPal / SEPA" />
          </Field>
          <Field label="Applied at">
            <input type="date" name="appliedAt" defaultValue={fmtDateInput(job.appliedAt)} className={inputCls} />
          </Field>
          <Field label="Qualification test at">
            <input type="date" name="qualTestAt" defaultValue={fmtDateInput(job.qualTestAt)} className={inputCls} />
          </Field>
          <div className="col-span-2">
            <Field label="Notes">
              <textarea name="notes" defaultValue={job.notes ?? ""} rows={3} className={inputCls + " resize-y"} />
            </Field>
          </div>
          <div className="col-span-2 flex justify-between items-center gap-2">
            <button
              type="button"
              onClick={async () => {
                if (confirm(`Delete "${job.platform} — ${job.role}"?`)) {
                  await deleteJob(job.id);
                }
              }}
              className="text-xs text-rose-600 hover:underline"
            >
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm border border-[#e8dec1] rounded-md px-3 py-1.5 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-sm bg-[var(--color-cocoa)] text-white rounded-md px-4 py-1.5 hover:opacity-90"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-[#e8dec1] rounded-md px-3 py-1.5 bg-white focus:outline-none focus:border-[var(--color-cocoa)]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[var(--color-ink-muted)] mb-1">{label}</span>
      {children}
    </label>
  );
}
