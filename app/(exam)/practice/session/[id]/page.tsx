import { notFound } from "next/navigation";
import { getCurrentUser, getQuestionsByIds, getSession } from "@/lib/data";
import { ExamScreen } from "@/components/exam/ExamScreen";
import type { SearchParams } from "@/lib/query";

export const metadata = {
  title: "Test session",
};

/**
 * The test-taking screen. It lives in the (exam) route group so it renders
 * without the sidebar and top bar of the main app shell, full width.
 */
export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const session = await getSession(id);
  if (!session) notFound();

  const questionIds = session.modules.flatMap((module) => module.questionIds);
  const [questions, user] = await Promise.all([
    getQuestionsByIds(questionIds),
    getCurrentUser("student"),
  ]);

  // A drill launched from the practice hub carries its configuration here.
  const skill = typeof query.skill === "string" ? query.skill : undefined;
  const drillOverride =
    session.kind === "drill" && skill
      ? {
          skill,
          count: Number.parseInt(typeof query.count === "string" ? query.count : "10", 10) || 10,
          timed: query.timed === "1",
        }
      : undefined;

  return (
    <ExamScreen
      session={session}
      questions={questions}
      studentName={user.name}
      drillOverride={drillOverride}
    />
  );
}
