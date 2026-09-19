import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, History } from "lucide-react";
import {
  getCurrentUser,
  getNow,
  getSessions,
  getStudent,
  getStudentAssignments,
  getStudentNotes,
  getStudentProgress,
  getStudents,
} from "@/lib/data";
import { PageHeader, SectionHeading, StatTile } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { DomainAccuracyChart } from "@/components/charts/DomainAccuracyChart";
import { CalendarHeatmap } from "@/components/charts/CalendarHeatmap";
import { SkillMasteryGrid } from "@/components/SkillMasteryGrid";
import { TutorNotes } from "@/components/TutorNotes";
import { ProgressBar } from "@/components/ProgressRing";
import { formatDate, formatPercent, formatRelative, signed } from "@/lib/utils";

export async function generateStaticParams() {
  const students = await getStudents();
  return students.map((student) => ({ id: student.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const student = await getStudent(id);
  return { title: student ? student.name : "Student" };
}

export default async function AdminStudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await getStudent(id);
  if (!student) notFound();

  const [progress, sessions, assignments, notes, tutor, now] = await Promise.all([
    getStudentProgress(id),
    getSessions(id),
    getStudentAssignments(id),
    getStudentNotes(id),
    getCurrentUser("admin"),
    getNow(),
  ]);

  const completedSessions = sessions.filter((session) => session.completedAt);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 text-meta text-ink-muted transition-ui hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to students
        </Link>
      </div>

      <PageHeader
        title={student.name}
        description={`${student.email} · Test on ${formatDate(student.testDate)} · Last active ${formatRelative(student.lastActiveAt, now)}`}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Estimated score"
          value={student.currentScore}
          hint={`${student.scoreRange[0]}–${student.scoreRange[1]} · target ${student.targetScore}`}
        />
        <StatTile
          label="Change (30 days)"
          value={signed(student.scoreChange30d)}
          tone={student.scoreChange30d >= 0 ? "positive" : "negative"}
          hint="Composite score movement"
        />
        <StatTile
          label="Questions solved"
          value={student.questionsSolved.toLocaleString("en-GB")}
          hint={`${formatPercent(student.accuracy)} accuracy`}
        />
        <StatTile
          label="Streak"
          value={`${student.streakDays} days`}
          hint={`${progress.averageTimeSeconds}s average per question`}
        />
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="Score trend" />
          <ScoreTrendChart data={progress.trend} height={280} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent>
            <SectionHeading title="Accuracy by domain" />
            <DomainAccuracyChart data={progress.domainAccuracy} height={320} />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <SectionHeading title="Assigned work" />
            {assignments.length === 0 ? (
              <EmptyState
                title="Nothing assigned"
                description="This student has no work set. Create an assignment to give them a focus."
              />
            ) : (
              <ul className="space-y-4">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[14px] text-ink">{assignment.title}</p>
                        <p className="mt-0.5 text-meta text-ink-muted">
                          {assignment.submittedAt
                            ? `Submitted ${formatDate(assignment.submittedAt)}`
                            : `${assignment.overdue ? "Overdue — due" : "Due"} ${formatDate(assignment.dueDate)}`}
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

      <Card>
        <CardContent>
          <SectionHeading title="Session history" />
          {completedSessions.length === 0 ? (
            <EmptyState
              icon={History}
              title="No completed sessions"
              description="Nothing to review yet for this student."
            />
          ) : (
            <ul className="divide-y divide-line">
              {completedSessions.map((session) => {
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

      <Card>
        <CardContent>
          <SectionHeading title="Per-skill mastery" />
          <SkillMasteryGrid skills={progress.skillMastery} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SectionHeading title="Activity" />
          <CalendarHeatmap days={progress.activity} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SectionHeading title="Tutor notes" />
          <TutorNotes notes={notes} author={tutor.name} studentId={student.id} />
        </CardContent>
      </Card>
    </div>
  );
}
