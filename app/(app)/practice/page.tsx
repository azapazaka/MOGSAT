import Link from "next/link";
import { Clock, Layers, Timer as TimerIcon } from "lucide-react";
import { getSessions, getStartableSessionIds } from "@/lib/data";
import { MODULE_LABELS, PRACTICE_TEST_SHAPE } from "@/lib/practice-shape";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DrillBuilder } from "@/components/DrillBuilder";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";
import type { SearchParams } from "@/lib/query";

export const metadata = { title: "Practice" };

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const skillParam = typeof params.skill === "string" ? params.skill : undefined;
  const [startable, sessions] = await Promise.all([
    getStartableSessionIds(),
    getSessions("s-01"),
  ]);

  const completed = sessions.filter((session) => session.completedAt);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Practice"
        description="Run a focused drill on a single skill, or sit a full-length adaptive-style test with two modules per section."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drills */}
        <Card>
          <CardContent className="space-y-6">
            <div>
              <Layers size={20} className="text-ink-muted" aria-hidden />
              <h2 className="mt-3 text-[17px] font-medium text-ink">Drills</h2>
              <p className="mt-1 text-[14px] text-ink-muted">
                Pick a skill and a length. Untimed for learning, timed for pacing.
              </p>
            </div>
            <DrillBuilder sessionId={startable.drill} initialSkill={skillParam} />
          </CardContent>
        </Card>

        {/* Practice tests */}
        <Card>
          <CardContent className="space-y-6">
            <div>
              <TimerIcon size={20} className="text-ink-muted" aria-hidden />
              <h2 className="mt-3 text-[17px] font-medium text-ink">Practice tests</h2>
              <p className="mt-1 text-[14px] text-ink-muted">
                Reading and Writing then Math, two modules each, in the digital test interface.
              </p>
            </div>

            <ol className="space-y-3">
              {PRACTICE_TEST_SHAPE.map((module, index) => (
                <li
                  key={`${module.section}-${module.order}`}
                  className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-0 last:pb-0"
                >
                  <span className="flex items-center gap-3 text-[14px] text-ink">
                    <span className="flex h-6 w-6 items-center justify-center rounded-input border border-line text-meta tabular-nums text-ink-muted">
                      {index + 1}
                    </span>
                    {MODULE_LABELS[module.section]} · Module {module.order}
                  </span>
                  <span className="flex items-center gap-3 text-meta tabular-nums text-ink-muted">
                    <span>{module.questions} questions</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={16} aria-hidden />
                      {module.minutes} min
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="rounded-input border border-line bg-paper p-3 text-meta text-ink-muted">
              Demo length: 8 questions per module rather than the full 27 and 22, with the
              timers scaled to match. Every module boundary behaves as it does on the real test.
            </div>

            <Button asChild variant="primary" size="lg" className="w-full">
              <Link href={`/practice/session/${startable.test}`}>Start practice test</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="Past sessions" />
          {completed.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No completed sessions yet"
              description="Finish a drill or a practice test and its review will appear here."
            />
          ) : (
            <ul className="divide-y divide-line">
              {completed.map((session) => {
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
                        {formatDate(session.completedAt!)} ·{" "}
                        {session.kind === "practice_test" ? "Practice test" : "Drill"} ·{" "}
                        {session.timed ? "Timed" : "Untimed"}
                      </p>
                    </div>
                    <span className="text-meta tabular-nums text-ink-muted">
                      {correct}/{session.results.length} correct
                    </span>
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/review/${session.id}`}>Review</Link>
                    </Button>
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
