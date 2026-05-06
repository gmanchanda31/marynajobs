import { db } from "./db";
import { jobs, type NewJob } from "./schema";

const seedRows: NewJob[] = [
  // Wave 1 — Tier 1 platforms (highest pay, multilingual-friendly)
  {
    platform: "DataAnnotation.tech",
    role: "AI Trainer (multilingual)",
    url: "https://www.dataannotation.tech/",
    status: "found",
    tier: "tier1",
    payRate: "$20–40/hr",
    paymentMethod: "Wise (USD)",
    notes: "Wave 1 — apply first. ~1hr writing test. Multilingual-friendly, fastest acceptance.",
  },
  {
    platform: "Outlier (Scale AI)",
    role: "European Portuguese annotator pool",
    url: "https://outlier.ai/",
    status: "found",
    tier: "tier1",
    payRate: "$15–30/hr",
    paymentMethod: "Wise (USD)",
    notes: "Wave 1 — filter for Portuguese (Portugal). Very high demand for native EU PT.",
  },
  {
    platform: "TELUS Digital",
    role: "Personalized Internet Ads Evaluator (Portugal)",
    url: "https://www.telusdigital.com/careers",
    status: "found",
    tier: "tier2",
    payRate: "€9–14/hr",
    paymentMethod: "SEPA",
    notes: "Wave 1 anchor — easy entry test, steady part-time. Apply in PT pool first; UA pool as backup.",
  },

  // Wave 2 — Tier 1/2 (after Wave 1 results)
  {
    platform: "Surge AI",
    role: "EU PT linguistic / RU/UK translation QA",
    url: "https://www.surgehq.ai/",
    status: "found",
    tier: "tier1",
    payRate: "$20–50/hr",
    paymentMethod: "Wise (USD)",
    notes: "Wave 2 — harder test but premium pay. PT/RU/UK languages all relevant.",
  },
  {
    platform: "Welocalize",
    role: "EU Portuguese language QA",
    url: "https://www.welocalize.com/careers/",
    status: "found",
    tier: "tier2",
    payRate: "$15–25/hr",
    paymentMethod: "Wise / PayPal",
    notes: "Wave 2 — steady localization contracts; values native EU PT.",
  },
  {
    platform: "Centific",
    role: "RU/UK content moderation",
    url: "https://www.centific.com/careers",
    status: "found",
    tier: "tier2",
    payRate: "varies",
    paymentMethod: "varies",
    notes: "Wave 2 — content mod with proper wellness program. Native RU/UK pair is high-demand.",
  },
  {
    platform: "Mercor",
    role: "Expert annotator (multilingual)",
    url: "https://mercor.com/",
    status: "found",
    tier: "tier1",
    payRate: "$25+/hr",
    paymentMethod: "Wise (USD)",
    notes: "Wave 2 — interview-style intake. Apply even without degree; language is the asset.",
  },

  // Adjacent (parallel track) — remote CS / WFM in EU
  {
    platform: "Revolut",
    role: "Multilingual remote CS (PT / RU / UK)",
    url: "https://www.revolut.com/careers/",
    status: "found",
    tier: "adjacent",
    payRate: "€1300–1800/mo",
    paymentMethod: "SEPA",
    notes: "Adjacent — match: 2yrs CS + EU PT + RU/UK.",
  },
  {
    platform: "Wise",
    role: "Multilingual remote CS",
    url: "https://wise.jobs/",
    status: "found",
    tier: "adjacent",
    payRate: "€1300–1700/mo",
    paymentMethod: "SEPA",
    notes: "Adjacent — fits her language stack and CS background.",
  },
  {
    platform: "Booking.com",
    role: "Customer Service (PT/UK/RU markets)",
    url: "https://jobs.booking.com/careers",
    status: "found",
    tier: "adjacent",
    payRate: "€1300–1600/mo",
    paymentMethod: "SEPA",
    notes: "Adjacent — Hostel volunteer experience with Booking.com is a relevant data point.",
  },
  {
    platform: "Concentrix Lisbon",
    role: "Remote CS / WFM analyst",
    url: "https://jobs.concentrix.com/global/en",
    status: "found",
    tier: "adjacent",
    payRate: "€1100–1500/mo + meal allowance",
    paymentMethod: "SEPA",
    notes: "Adjacent — also has WFM analyst openings; her Konecta-Zara WFM experience qualifies.",
  },
  {
    platform: "TaskUs",
    role: "RU/UK content moderation",
    url: "https://www.taskus.com/careers/",
    status: "found",
    tier: "adjacent",
    payRate: "$1200–1800/mo",
    paymentMethod: "Wise / SEPA",
    notes: "Adjacent — content mod with wellness program. RU/UK pair in demand.",
  },

  // Microtask top-ups (passive backup)
  {
    platform: "Prolific",
    role: "Research microtasks (PT/RU/UK)",
    url: "https://www.prolific.com/",
    status: "found",
    tier: "microtask",
    payRate: "£8–15/hr",
    paymentMethod: "PayPal / Wise",
    notes: "Microtask — register and configure profile for PT/RU/UK to maximize task pool.",
  },
  {
    platform: "Toloka",
    role: "Microtasks (Yandex spinoff)",
    url: "https://toloka.ai/",
    status: "found",
    tier: "microtask",
    payRate: "varies",
    paymentMethod: "PayPal",
    notes: "Microtask — heavy on RU tasks.",
  },
  {
    platform: "Clickworker",
    role: "Microtasks (varied)",
    url: "https://www.clickworker.com/",
    status: "found",
    tier: "microtask",
    payRate: "varies",
    paymentMethod: "PayPal / SEPA",
    notes: "Microtask — varied pool, light commitment.",
  },
];

async function main() {
  console.log(`Seeding ${seedRows.length} jobs...`);
  for (const row of seedRows) {
    await db.insert(jobs).values(row).onConflictDoNothing();
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
