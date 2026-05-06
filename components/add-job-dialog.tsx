"use client";

import { useState, useTransition } from "react";
import { addJob } from "@/lib/actions";
import { STATUSES, STATUS_LABELS, TIERS, TIER_LABELS } from "@/lib/schema";

export function AddJobDialog() {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const submit = (formData: FormData) => {
    start(async () => {
      await addJob(formData);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm bg-[var(--color-cocoa)] text-white rounded-md px-4 py-2 hover:opacity-90"
      >
        + Add job
      </button>

      {open ? (
        <div
          className="fixed inset-0 bg-black/30 z-50 grid place-items-center px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white border border-[#e8dec1] rounded-xl p-6 w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-1">Add a job</h2>
            <p className="text-xs text-[var(--color-ink-muted)] mb-4">Quick entry. Edit details after saving.</p>
            <form action={submit} className="grid grid-cols-2 gap-3">
              <Field label="Platform *">
                <input required name="platform" className={inputCls} placeholder="Outlier" />
              </Field>
              <Field label="Role *">
                <input required name="role" className={inputCls} placeholder="EU PT annotator" />
              </Field>
              <Field label="Status">
                <select name="status" className={inputCls} defaultValue="found">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tier">
                <select name="tier" className={inputCls} defaultValue="tier1">
                  {TIERS.map((t) => (
                    <option key={t} value={t}>{TIER_LABELS[t]}</option>
                  ))}
                </select>
              </Field>
              <div className="col-span-2">
                <Field label="Job URL">
                  <input name="url" className={inputCls} placeholder="https://..." />
                </Field>
              </div>
              <Field label="Pay rate">
                <input name="payRate" className={inputCls} placeholder="$25/hr" />
              </Field>
              <Field label="Payment method">
                <input name="paymentMethod" className={inputCls} placeholder="Wise" />
              </Field>
              <div className="col-span-2">
                <Field label="Notes">
                  <textarea name="notes" rows={2} className={inputCls + " resize-y"} />
                </Field>
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm border border-[#e8dec1] rounded-md px-3 py-1.5 hover:bg-[#faf6ec]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="text-sm bg-[var(--color-cocoa)] text-white rounded-md px-4 py-1.5 hover:opacity-90 disabled:opacity-50"
                >
                  {pending ? "Saving…" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
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
