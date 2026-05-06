"use server";

import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { db } from "./db";
import { jobs, STATUSES, TIERS, type Status, type Tier } from "./schema";

function asStatus(v: unknown): Status {
  return STATUSES.includes(v as Status) ? (v as Status) : "found";
}
function asTier(v: unknown): Tier {
  return TIERS.includes(v as Tier) ? (v as Tier) : "tier1";
}
function strOrNull(v: FormDataEntryValue | null): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}
function dateOrNull(v: FormDataEntryValue | null): Date | null {
  const s = strOrNull(v);
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export async function addJob(formData: FormData) {
  const platform = strOrNull(formData.get("platform"));
  const role = strOrNull(formData.get("role"));
  if (!platform || !role) return;

  await db.insert(jobs).values({
    platform,
    role,
    url: strOrNull(formData.get("url")),
    status: asStatus(formData.get("status")),
    tier: asTier(formData.get("tier")),
    payRate: strOrNull(formData.get("payRate")),
    paymentMethod: strOrNull(formData.get("paymentMethod")),
    notes: strOrNull(formData.get("notes")),
  });
  revalidatePath("/");
}

export async function updateJob(id: number, formData: FormData) {
  const status = asStatus(formData.get("status"));
  await db
    .update(jobs)
    .set({
      status,
      payRate: strOrNull(formData.get("payRate")),
      paymentMethod: strOrNull(formData.get("paymentMethod")),
      url: strOrNull(formData.get("url")),
      appliedAt: dateOrNull(formData.get("appliedAt")),
      qualTestAt: dateOrNull(formData.get("qualTestAt")),
      notes: strOrNull(formData.get("notes")),
      updatedAt: sql`now()`,
    })
    .where(eq(jobs.id, id));
  revalidatePath("/");
}

export async function quickStatus(id: number, status: Status) {
  await db
    .update(jobs)
    .set({ status, updatedAt: sql`now()` })
    .where(eq(jobs.id, id));
  revalidatePath("/");
}

export async function deleteJob(id: number) {
  await db.delete(jobs).where(eq(jobs.id, id));
  revalidatePath("/");
}
