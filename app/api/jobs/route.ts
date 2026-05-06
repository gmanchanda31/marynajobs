import { NextResponse, type NextRequest } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, STATUSES, TIERS, type Status, type Tier } from "@/lib/schema";
import { verifyBotToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  if (!verifyBotToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(jobs).orderBy(desc(jobs.updatedAt));
  return NextResponse.json({ jobs: rows });
}

export async function POST(req: NextRequest) {
  if (!verifyBotToken(req.headers.get("authorization"))) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const platform = typeof body.platform === "string" ? body.platform.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  if (!platform || !role) {
    return NextResponse.json({ error: "platform and role are required" }, { status: 400 });
  }

  const status: Status = STATUSES.includes(body.status as Status)
    ? (body.status as Status)
    : "found";
  const tier: Tier = TIERS.includes(body.tier as Tier) ? (body.tier as Tier) : "tier1";

  const [created] = await db
    .insert(jobs)
    .values({
      platform,
      role,
      status,
      tier,
      url: typeof body.url === "string" ? body.url : null,
      payRate: typeof body.payRate === "string" ? body.payRate : null,
      paymentMethod: typeof body.paymentMethod === "string" ? body.paymentMethod : null,
      notes: typeof body.notes === "string" ? body.notes : null,
      appliedAt: typeof body.appliedAt === "string" ? new Date(body.appliedAt) : null,
      qualTestAt: typeof body.qualTestAt === "string" ? new Date(body.qualTestAt) : null,
    })
    .returning();

  return NextResponse.json({ job: created }, { status: 201 });
}
