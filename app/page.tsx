import { db } from "@/lib/db";
import { jobs, STATUSES, type Status } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { PipelineSummary } from "@/components/pipeline-summary";
import { JobRow } from "@/components/job-row";
import { AddJobDialog } from "@/components/add-job-dialog";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ status?: string }> };

export default async function HomePage({ searchParams }: Props) {
  const params = await searchParams;
  const requestedStatus = params.status as Status | undefined;
  const statusFilter: Status | "all" = STATUSES.includes(requestedStatus as Status)
    ? (requestedStatus as Status)
    : "all";

  const allJobs = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.updatedAt));

  const counts = STATUSES.reduce(
    (acc, s) => {
      acc[s] = allJobs.filter((j) => j.status === s).length;
      return acc;
    },
    {} as Record<Status, number>,
  );

  const filtered = statusFilter === "all" ? allJobs : allJobs.filter((j) => j.status === statusFilter);

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-ink)]">Maryna&apos;s Job Tracker</h1>
          <p className="text-sm text-[var(--color-ink-muted)]">
            {allJobs.length} total · {counts.active} active · {counts.in_test} in test · {counts.applied} applied
          </p>
        </div>
        <AddJobDialog />
      </div>

      <div className="mt-6">
        <PipelineSummary counts={counts} active={statusFilter} />
      </div>

      <div className="mt-6 bg-white border border-[#e8dec1] rounded-xl overflow-hidden">
        <div className="grid grid-cols-12 gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-ink-muted)] bg-[#faf6ec] border-b border-[#ece2c8]">
          <div className="col-span-3">Platform</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Pay</div>
          <div className="col-span-1 text-right">Updated</div>
          <div className="col-span-1 text-right">Link</div>
        </div>
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-[var(--color-ink-muted)]">
            No jobs in this view yet.
          </div>
        ) : (
          filtered.map((job) => <JobRow key={job.id} job={job} />)
        )}
      </div>

      <p className="mt-6 text-center text-xs text-[var(--color-ink-muted)]">
        Click any row to edit · Bot writes to <code>/api/jobs</code>
      </p>
    </main>
  );
}
