import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { getAssignments, getNow, getStudents } from "@/lib/data";
import { PageHeader, SectionHeading } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { AssignmentBuilder } from "@/components/AssignmentBuilder";
import { ProgressBar } from "@/components/ProgressRing";
import { DomainBadge } from "@/components/DomainBadge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata = { title: "Assignments" };

export default async function AdminAssignmentsPage() {
  const [assignments, students, now] = await Promise.all([
    getAssignments(),
    getStudents(),
    getNow(),
  ]);

  const nameById = new Map(students.map((student) => [student.id, student.name]));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Assignments"
        description="Set targeted work for one student or a group, and watch it come back."
      />

      <Card>
        <CardContent>
          <SectionHeading title="Create an assignment" />
          <AssignmentBuilder students={students} />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <SectionHeading title={`Active assignments (${assignments.length})`} />
          {assignments.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No assignments yet"
              description="Create one above and it will appear here with completion status."
            />
          ) : (
            <div className="space-y-6">
              {assignments.map((assignment) => {
                const submitted = assignment.completion.filter((entry) => entry.submittedAt).length;
                const overdue = Date.parse(assignment.dueDate) < now && submitted < assignment.completion.length;

                return (
                  <article key={assignment.id} className="rounded-card border border-line p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-medium text-ink">{assignment.title}</h3>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          {assignment.source.kind === "skill" ? (
                            <>
                              <DomainBadge domain={assignment.source.domain} />
                              <span className="text-meta text-ink-muted">
                                {assignment.source.skill} · {assignment.source.questionCount} questions
                              </span>
                            </>
                          ) : (
                            <span className="text-meta text-ink-muted">
                              {assignment.source.questionIds.length} hand-picked questions
                            </span>
                          )}
                          {assignment.groupLabel ? (
                            <span className="text-meta text-ink-muted">· {assignment.groupLabel}</span>
                          ) : null}
                        </div>
                        {assignment.instructions ? (
                          <p className="mt-3 max-w-[70ch] text-meta text-ink-muted">
                            {assignment.instructions}
                          </p>
                        ) : null}
                      </div>

                      <div className="text-right">
                        <p
                          className={cn(
                            "text-[14px]",
                            overdue ? "text-incorrect" : "text-ink-muted",
                          )}
                        >
                          {overdue ? "Overdue — due " : "Due "}
                          {formatDate(assignment.dueDate)}
                        </p>
                        <p className="mt-1 text-meta tabular-nums text-ink-muted">
                          {submitted} of {assignment.completion.length} submitted
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Table>
                        <THead>
                          <TR className="border-b-0">
                            <TH>Student</TH>
                            <TH>Progress</TH>
                            <TH>Status</TH>
                          </TR>
                        </THead>
                        <TBody>
                          {assignment.completion.map((entry) => (
                            <TR key={entry.studentId}>
                              <TD>
                                <Link
                                  href={`/admin/students/${entry.studentId}`}
                                  className="transition-ui hover:text-accent"
                                >
                                  {nameById.get(entry.studentId) ?? entry.studentId}
                                </Link>
                              </TD>
                              <TD>
                                <div className="flex items-center gap-3">
                                  <span className="w-12 shrink-0 tabular-nums text-ink-muted">
                                    {entry.completed}/{entry.total}
                                  </span>
                                  <ProgressBar
                                    value={entry.completed}
                                    max={entry.total}
                                    className="w-24"
                                    label={`${nameById.get(entry.studentId)} progress`}
                                  />
                                </div>
                              </TD>
                              <TD className="text-ink-muted">
                                {entry.submittedAt
                                  ? `Submitted ${formatDate(entry.submittedAt)}`
                                  : entry.completed === 0
                                    ? "Not started"
                                    : "In progress"}
                              </TD>
                            </TR>
                          ))}
                        </TBody>
                      </Table>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
