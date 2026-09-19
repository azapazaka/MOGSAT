import { getAssignments, getNow, getStudents } from "@/lib/data";
import { PageHeader } from "@/components/PageHeader";
import { StudentTable } from "@/components/StudentTable";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Students" };

export default async function AdminStudentsPage() {
  const [students, assignments, now] = await Promise.all([
    getStudents(),
    getAssignments(),
    getNow(),
  ]);

  // "2 of 3 submitted" per student, across every assignment they were given.
  const assignmentStatus: Record<string, string> = {};
  for (const student of students) {
    const theirs = assignments.filter((assignment) =>
      assignment.assigneeIds.includes(student.id),
    );
    if (theirs.length === 0) {
      assignmentStatus[student.id] = "None set";
      continue;
    }
    const submitted = theirs.filter((assignment) =>
      assignment.completion.find((entry) => entry.studentId === student.id)?.submittedAt,
    ).length;
    assignmentStatus[student.id] = `${submitted} of ${theirs.length} submitted`;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Students"
        description="Search and sort the cohort. Select a student for their full profile."
      />
      <Card>
        <CardContent>
          <StudentTable students={students} now={now} assignmentStatus={assignmentStatus} />
        </CardContent>
      </Card>
    </div>
  );
}
