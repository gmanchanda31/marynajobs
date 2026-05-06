import { NextResponse, type NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, STATUSES, TIERS, type Status, type Tier } from "@/lib/schema";
import { verifyBotToken } from "@/lib/auth";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  if (!verifyBotToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const update: Record<string, unknown> = { updatedAt: sql`now()` };

  if (typeof body.platform === "string") update.platform = body.platform;
  if (typeof body.role === "string") update.role = body.role;
  if (typeof body.url === "string") update.url = body.url;
  if (typeof body.payRate === "string") update.payRate = body.payRate;
  if (typeof body.paymentMethod === "string") update.paymentMethod = body.paymentMethod;
  if (typeof body.notes === "string") update.notes = body.notes;
  if (STATUSES.includes(body.status as Status)) update.status = body.status;
  if (TIERS.includes(body.tier as Tier)) update.tier = body.tier;
  if (typeof body.appliedAt === "string") update.appliedAt = new Date(body.appliedAt);
  if (typeof body.qualTestAt === "string") update.qualTestAt = new Date(body.qualTestAt);

  const [updated] = await db.update(jobs).set(update).where(eq(jobs.id, id)).returning();
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ job: updated });
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!verifyBotToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id: idStr } = await ctx.params;
  const id = Number(idStr);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "invalid id" }, { status: 400 });
  }
  await db.delete(jobs).where(eq(jobs.id, id));
  return NextResponse.json({ ok: true });
}
