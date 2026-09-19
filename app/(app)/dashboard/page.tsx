import Link from "next/link";
import { ArrowRight, CalendarDays, ClipboardList, Flame, History } from "lucide-react";
import {
  getDashboardSummary,
  getNow,
  getStartableSessionIds,
} from "@/lib/data";
import { PageHeader, SectionHeading, StatTile } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { ProgressBar, ProgressRing } from "@/components/ProgressRing";
import { DomainBadge } from "@/components/DomainBadge";
import { DomainAccuracyChart } from "@/components/charts/DomainAccuracyChart";
import { formatDate, formatPercent, formatRelative, signed } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [summary, now, startable] = await Promise.all([
    getDashboardSummary(),
    getNow(),
    getStartableSessionIds(),
  ]);

  if (!summary) {
    return <EmptyState title="No student record found" description="Stage 2 will resolve this from the signed-in session." />;
  }

  const firstName = summary.student.name.split(" ")[0];
  const outstanding = summary.assignments.filter((assignment) => !assignment.submittedAt);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Good to see you, ${firstName}`}
        description={`${summary.daysUntilTest} days until your test on ${formatDate(summary.student.testDate)}.`}
        actions={
          <Button asChild variant="primary">
            <Link href={`/practice/session/${startable.test}`}>Start a practice test</Link>
          </Button>
        }
      />

      {/* Score, at the top, with the one ring in the design system. */}
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <Card>
          <CardContent className="flex flex-col items-center py-8">
            <ProgressRing
              value={summary.estimatedScore - 400}
              max={1600 - 400}
              label={summary.estimatedScore}
              caption={`${summary.scoreRange[0]}–${summary.scoreRange[1]} range`}
            />
            <div className="mt-6 w-full space-y-3 text-center">
              <p className="text-meta text-ink-muted">
                <span
                  className={summary.scoreChange30d >= 0 ? "text-correct" : "text-incorrect"}
                >
                  {signed(summary.scoreChange30d)}
                </span>{" "}
                in the last 30 days
              </p>
              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-meta text-ink-muted">
                  <span>Target {summary.targetScore}</span>
                  <span className="tabular-nums">
                    {Math.max(0, summary.targetScore - summary.estimatedScore)} to go
                  </span>
                </div>
                <ProgressBar
                  value={summary.estimatedScore - 400}
                  max={summary.targetScore - 400}
                  tone="ink"
                  label="Progress towards target score"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <StatTile
            label="Study streak"
            value={`${summary.streakDays} days`}
            hint={
              <span className="inline-flex items-center gap-2">
                <Flame size={16} aria-hidden />
                Keep it going with a short drill
              </span>
            }
          />
          <StatTile
            label="Questions solved"
            value={summary.questionsSolved.toLocaleString("en-GB")}
            hint={`${formatPercent(summary.accuracy)} accuracy overall`}
          />
          <StatTile
            label="Assigned work"
            value={`${outstanding.length} open`}
            hint={
              outstanding.length === 0
                ? "Everything submitted"
                : `Next due ${formatDate(outstanding[0].dueDate)}`
            }
            tone={outstanding.some((item) => item.overdue) ? "negative" : "default"}
          />
          <StatTile
            label="Test date"
            value={`${summary.daysUntilTest}d`}
            hint={
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} aria-hidden />
                {formatDate(summary.student.testDate)}
              </span>
            }
          />
        </div>
      </div>

      {/* Next recommended drill. */}
      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-6">
          <div className="min-w-0">
            <p className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
              Recommended next
            </p>
            <p className="mt-2 text-[17px] text-ink">{summary.recommendedDrill.skill}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <DomainBadge domain={summary.recommendedDrill.domain} />
              <span className="text-meta text-ink-muted">{summary.recommendedDrill.reason}</span>
            </div>
          </div>
          <Button asChild variant="primary">
            <Link href={`/practice?skill=${encodeURIComponent(summary.recommendedDrill.skill)}`}>
              Drill {summary.recommendedDrill.questionCount} questions
              <ArrowRight size={16} />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Accuracy by domain. */}
        <Card>
          <CardContent>
            <SectionHeading
              title="Accuracy by domain"
              action={
                <Link href="/progress" className="text-meta text-ink-muted underline underline-offset-2 transition-ui hover:text-ink">
                  Full progress
                </Link>
              }
            />
            <DomainAccuracyChart data={summary.domainAccuracy} height={320} />
          </CardContent>
        </Card>

        {/* Assigned work from the tutor. */}
        <Card>
          <CardContent>
            <SectionHeading title="From your tutor" />
            {summary.assignments.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No assigned work"
                description="Your tutor has not set anything yet. Pick a drill in the meantime."
              />
            ) : (
              <ul className="space-y-4">
                {summary.assignments.map((assignment) => (
                  <li key={assignment.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[14px] text-ink">{assignment.title}</p>
                        <p className="mt-1 text-meta text-ink-muted">
                          {assignment.submittedAt ? (
                            <>Submitted {formatDate(assignment.submittedAt)}</>
                          ) : (
                            <span className={assignment.overdue ? "text-incorrect" : undefined}>
                              {assignment.overdue ? "Overdue — due " : "Due "}
                              {formatDate(assignment.dueDate)}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="shrink-0 text-meta tabular-nums text-ink-muted">
                        {assignment.completed}/{assignment.total}
                      </span>
                    </div>
                    <ProgressBar
                      value={assignment.completed}
                      max={assignment.total}
                      className="mt-3"
                      label={`${assignment.title} progress`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent sessions. */}
      <Card>
        <CardContent>
          <SectionHeading title="Recent sessions" />
          {summary.recentSessions.length === 0 ? (
            <EmptyState
              icon={History}
              title="No sessions yet"
              description="Take a practice test or run a drill and it will show up here."
              action={
                <Button asChild variant="primary">
                  <Link href="/practice">Go to practice</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {summary.recentSessions.map((session) => {
                const correct = session.results.filter((result) => result.correct).length;
                return (
                  <li key={session.id} className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/review/${session.id}`}
                        className="text-[14px] text-ink transition-ui hover:text-accent"
                      >
                        {session.title}
                      </Link>
                      <p className="mt-0.5 text-meta text-ink-muted">
                        {formatRelative(session.completedAt ?? session.startedAt, now)} ·{" "}
                        {session.kind === "practice_test" ? "Practice test" : "Drill"}
                        {session.timed ? " · Timed" : " · Untimed"}
                      </p>
                    </div>
                    <span className="text-meta tabular-nums text-ink-muted">
                      {correct}/{session.results.length} correct
                    </span>
                    {session.scoreTotal ? (
                      <span className="w-16 text-right text-[15px] font-medium tabular-nums text-ink">
                        {session.scoreTotal}
                      </span>
                    ) : (
                      <span className="w-16" />
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
