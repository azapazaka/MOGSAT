import Link from "next/link";
import { AlertTriangle, CalendarClock, Users } from "lucide-react";
import { getCohortOverview, getNow } from "@/lib/data";
import { PageHeader, SectionHeading, StatTile } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ProgressBar } from "@/components/ProgressRing";
import { formatDate, formatPercent, formatRelative, signed } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Cohort overview" };

const STANDING_COPY = {
  falling_behind: "Falling behind",
  needs_attention: "Needs attention",
  on_track: "On track",
} as const;

export default async function AdminOverviewPage() {
  const [overview, now] = await Promise.all([getCohortOverview(), getNow()]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Cohort overview"
        description="How your students are doing this week, and who needs a nudge."
        actions={
          <Button asChild variant="primary">
            <Link href="/admin/assignments">Create assignment</Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total students"
          value={overview.totalStudents}
          hint="Across both tutors"
        />
        <StatTile
          label="Active this week"
          value={overview.activeThisWeek}
          hint={`${overview.questionsThisWeek.toLocaleString("en-GB")} questions answered`}
        />
        <StatTile
          label="Average score change"
          value={signed(overview.averageScoreChange)}
          hint="Last 30 days"
          tone={overview.averageScoreChange >= 0 ? "positive" : "negative"}
        />
        <StatTile
          label="Average accuracy"
          value={formatPercent(overview.averageAccuracy)}
          hint="Cohort-wide, all domains"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SectionHeading
              title="Needs attention"
              action={
                <Link href="/admin/students" className="text-meta text-ink-muted underline underline-offset-2 transition-ui hover:text-ink">
                  All students
                </Link>
              }
            />
            {overview.fallingBehind.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Everyone is on track"
                description="No student is behind on volume, accuracy or assigned work."
              />
            ) : (
              <ul className="divide-y divide-line">
                {overview.fallingBehind.map((student) => (
                  <li key={student.id} className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-[14px] text-ink transition-ui hover:text-accent"
                      >
                        {student.name}
                      </Link>
                      <p className="mt-0.5 flex flex-wrap items-center gap-2 text-meta text-ink-muted">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            student.standing === "falling_behind" && "text-incorrect",
                          )}
                        >
                          {student.standing === "falling_behind" ? (
                            <AlertTriangle size={16} aria-hidden />
                          ) : null}
                          {STANDING_COPY[student.standing]}
                        </span>
                        <span>· Last active {formatRelative(student.lastActiveAt, now)}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[14px] tabular-nums text-ink">
                        {student.currentScore}
                        <span className="ml-2 text-meta text-ink-muted">
                          target {student.targetScore}
                        </span>
                      </p>
                      <p
                        className={cn(
                          "text-meta tabular-nums",
                          student.scoreChange30d >= 0 ? "text-correct" : "text-incorrect",
                        )}
                      >
                        {signed(student.scoreChange30d)} in 30 days
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionHeading
              title="Upcoming deadlines"
              action={
                <Link href="/admin/assignments" className="text-meta text-ink-muted underline underline-offset-2 transition-ui hover:text-ink">
                  All assignments
                </Link>
              }
            />
            {overview.upcomingDeadlines.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Nothing due"
                description="No assignment has a future due date."
              />
            ) : (
              <ul className="space-y-4">
                {overview.upcomingDeadlines.map(({ assignment, outstanding }) => {
                  const submitted = assignment.completion.filter((entry) => entry.submittedAt).length;
                  return (
                    <li key={assignment.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[14px] text-ink">{assignment.title}</p>
                          <p className="mt-0.5 text-meta text-ink-muted">
                            Due {formatDate(assignment.dueDate)} · {outstanding} outstanding
                          </p>
                        </div>
                        <span className="shrink-0 text-meta tabular-nums text-ink-muted">
                          {submitted}/{assignment.completion.length}
                        </span>
                      </div>
                      <ProgressBar
                        value={submitted}
                        max={assignment.completion.length}
                        className="mt-3"
                        label={`${assignment.title} submissions`}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
