import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bookmark, Flag } from "lucide-react";
import { getAllQuestions, getQuestion } from "@/lib/data";
import { DifficultyBadge, DomainBadge } from "@/components/DomainBadge";
import { QuestionPractice } from "@/components/QuestionPractice";
import { formatDuration } from "@/lib/utils";

export async function generateStaticParams() {
  const questions = await getAllQuestions();
  return questions.map((question) => ({ id: question.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getQuestion(id);
  return { title: question ? question.skill : "Question" };
}

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await getQuestion(id);
  if (!question) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/question-bank"
          className="inline-flex items-center gap-2 text-meta text-ink-muted transition-ui hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to the question bank
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <DomainBadge domain={question.domain} />
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="text-meta text-ink-muted">{question.skill}</span>
          <span className="text-meta text-ink-muted">
            ~{formatDuration(question.estimatedTimeSeconds)} expected
          </span>
          {question.state.saved ? (
            <span className="inline-flex items-center gap-1 text-meta text-ink-muted">
              <Bookmark size={16} aria-hidden />
              Saved
            </span>
          ) : null}
          {question.state.flagged ? (
            <span className="inline-flex items-center gap-1 text-meta text-flagged">
              <Flag size={16} aria-hidden />
              Flagged
            </span>
          ) : null}
        </div>
      </div>

      <QuestionPractice question={question} />
    </div>
  );
}
