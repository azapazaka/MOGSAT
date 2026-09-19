import Link from "next/link";
import { BookOpen, Bookmark } from "lucide-react";
import { getQuestions } from "@/lib/data";
import { hasActiveFilters, parseQuestionFilters, serializeQuestionFilters, type SearchParams } from "@/lib/query";
import { PageHeader } from "@/components/PageHeader";
import { QuestionBankFilters } from "@/components/QuestionBankFilters";
import { QuestionCard } from "@/components/QuestionCard";
import { Pagination } from "@/components/Pagination";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = { title: "Question bank" };

export default async function QuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filters = parseQuestionFilters(params);
  const results = await getQuestions(filters);
  const serialized = serializeQuestionFilters(filters);

  const savedTabParams = new URLSearchParams(serialized);
  savedTabParams.delete("page");
  savedTabParams.set("saved", "1");

  const allTabParams = new URLSearchParams(serialized);
  allTabParams.delete("page");
  allTabParams.delete("saved");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Question bank"
        description="Filter by section, domain, skill, difficulty and your own history. Every question reveals a worked explanation after you answer."
      />

      {/* Saved / flagged is a view of the same bank rather than a separate page. */}
      <div className="flex items-center gap-6 border-b border-line">
        <TabLink
          href={allTabParams.toString() ? `/question-bank?${allTabParams}` : "/question-bank"}
          active={!filters.savedOnly}
        >
          All questions
        </TabLink>
        <TabLink href={`/question-bank?${savedTabParams}`} active={Boolean(filters.savedOnly)}>
          Saved and flagged
        </TabLink>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <QuestionBankFilters filters={filters} />

        <div className="min-w-0 space-y-6">
          {results.items.length === 0 ? (
            <EmptyState
              icon={filters.savedOnly ? Bookmark : BookOpen}
              title={
                filters.savedOnly
                  ? "Nothing saved or flagged yet"
                  : "No questions match these filters"
              }
              description={
                filters.savedOnly
                  ? "Flag a question while you practise, or save one to come back to, and it will appear here."
                  : "Try removing a filter or widening the difficulty range."
              }
              action={
                hasActiveFilters(filters) ? (
                  <Button asChild variant="secondary">
                    <Link href="/question-bank">Clear all filters</Link>
                  </Button>
                ) : null
              }
            />
          ) : (
            <>
              <div className="space-y-3">
                {results.items.map((question) => (
                  <QuestionCard key={question.id} question={question} />
                ))}
              </div>
              <Pagination
                page={results.page}
                pageCount={results.pageCount}
                total={results.total}
                basePath="/question-bank"
                params={serialized}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "-mb-px border-b-2 pb-3 text-[14px] transition-ui",
        active ? "border-accent text-ink" : "border-transparent text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
