import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  role: text("role").notNull(),
  url: text("url"),
  status: text("status").notNull().default("found"),
  tier: text("tier").notNull().default("tier1"),
  payRate: text("pay_rate"),
  paymentMethod: text("payment_method"),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
  qualTestAt: timestamp("qual_test_at", { withTimezone: true }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;

export const STATUSES = ["found", "applied", "in_test", "active", "closed", "withdrawn"] as const;
export type Status = (typeof STATUSES)[number];

export const TIERS = ["tier1", "tier2", "microtask", "adjacent"] as const;
export type Tier = (typeof TIERS)[number];

export const STATUS_LABELS: Record<Status, string> = {
  found: "Found",
  applied: "Applied",
  in_test: "In Test",
  active: "Active",
  closed: "Closed",
  withdrawn: "Withdrawn",
};

export const TIER_LABELS: Record<Tier, string> = {
  tier1: "Tier 1",
  tier2: "Tier 2",
  microtask: "Microtask",
  adjacent: "Adjacent",
};
