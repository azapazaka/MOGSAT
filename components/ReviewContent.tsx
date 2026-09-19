"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Check, Clock, Flag, Minus, X } from "lucide-react";
import type { SessionReview, SessionQuestionResult } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { StatTile, SectionHeading } from "@/components/PageHeader";
import { DifficultyBadge, DomainBadge } from "@/components/DomainBadge";
import { ProgressBar } from "@/components/ProgressRing";
import { MathExpression } from "@/components/MathExpression";
import { QuestionFigureBlock, QuestionTableBlock } from "@/components/QuestionViewer";
import { loadAttempt } from "@/lib/session-store";
import { useHydrated } from "@/lib/use-hydrated";
import { estimateSectionScore, estimateTotalScore } from "@/lib/scoring";
import { formatDuration, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

/**
 * Review of a completed session.
 *
 * If this browser just finished the session, the attempt stored in
 * sessionStorage wins, so you see the answers you actually gave. Otherwise the
 * canned mock attempt is shown. Stage 2 always reads the real attempt rows and
 * the overlay disappears.
 */
export function ReviewContent({ review }: { review: SessionReview }) {
  // sessionStorage is only readable once the client has taken over, so the
  // server and the hydration pass both render the stored mock attempt and the
  // live one replaces it in the next render.
  const hydrated = useHydrated();

  const { results, isLiveAttempt } = useMemo(() => {
    const attempt = hydrated ? loadAttempt(review.session.id) : null;
    if (!attempt) {
      return { results: review.session.results, isLiveAttempt: false };
    }

    const overlaid: SessionQuestionResult[] = review.questions.map((question) => {
      const answer = attempt.answers[question.id] ?? null;
      return {
        questionId: question.id,
        answer,
        correct: answer !== null && isCorrect(question, answer),
        flagged: Boolean(attempt.flags[question.id]),
        timeSpentSeconds: attempt.timeSpent[question.id] ?? 0,
      };
    });

    return { results: overlaid, isLiveAttempt: true };
  }, [hydrated, review]);

  const correctCount = results.filter((result) => result.correct).length;
  const total = review.totalQuestions;
  const accuracy = total === 0 ? 0 : correctCount / total;
  const totalTime = results.reduce((sum, result) => sum + result.timeSpentSeconds, 0);

  // A test finished in this browser has no stored score, so estimate one from
  // the attempt rather than showing a dash on the screen that matters most.
  const scores = useMemo(() => {
    if (review.session.kind !== "practice_test") return null;
    if (!isLiveAttempt && review.session.scoreTotal) {
      return {
        total: review.session.scoreTotal,
        math: review.session.scoreMath,
        rw: review.session.scoreRw,
        estimated: false,
      };
    }

    const sectionAccuracy = (section: "math" | "rw") => {
      const scoped = review.questions.filter((question) => question.section === section);
      if (scoped.length === 0) return 0;
      const right = scoped.filter(
        (question) => results.find((r) => r.questionId === question.id)?.correct,
      ).length;
      return right / scoped.length;
    };

    const math = sectionAccuracy("math");
    const rw = sectionAccuracy("rw");
    return {
      total: estimateTotalScore(math, rw),
      math: estimateSectionScore(math),
      rw: estimateSectionScore(rw),
      estimated: true,
    };
  }, [review, results, isLiveAttempt]);

  const resultFor = (questionId: string) =>
    results.find((result) => result.questionId === questionId);

  // Recompute the domain breakdown from whichever attempt is being shown.
  const domainRows = review.domainBreakdown.map((row) => {
    const scoped = review.questions.filter((question) => question.domain === row.domain);
    const scopedResults = scoped
      .map((question) => resultFor(question.id))
      .filter((result): result is SessionQuestionResult => Boolean(result));
    const scopedCorrect = scopedResults.filter((result) => result.correct).length;
    return {
      ...row,
      attempted: scopedResults.length,
      correct: scopedCorrect,
      accuracy: scopedResults.length === 0 ? 0 : scopedCorrect / scopedResults.length,
    };
  });

  return (
    <div className="space-y-8">
      {isLiveAttempt ? (
        <p className="rounded-input border border-line bg-surface p-3 text-meta text-ink-muted">
          Showing the attempt you just completed in this browser. Stage 2 stores attempts
          server-side so they are available on any device.
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label={scores?.estimated ? "Estimated score" : "Score"}
          value={scores?.total ?? "—"}
          hint={
            scores
              ? `Math ${scores.math} · R&W ${scores.rw}`
              : "Drills are not scored on the 1600 scale"
          }
        />
        <StatTile label="Correct" value={`${correctCount}/${total}`} hint={formatPercent(accuracy)} />
        <StatTile
          label="Total time"
          value={formatDuration(totalTime)}
          hint={`${total === 0 ? 0 : Math.round(totalTime / total)}s per question`}
        />
        <StatTile
          label="Marked for review"
          value={results.filter((result) => result.flagged).length}
          hint="Flagged while working"
        />
      </div>

      <Card>
        <CardContent>
          <SectionHeading title="By domain" />
          <ul className="space-y-4">
            {domainRows.map((row) => (
              <li key={row.domain}>
                <div className="flex items-center justify-between gap-4 text-[14px]">
                  <span className="text-ink">{row.domain}</span>
                  <span className="shrink-0 tabular-nums text-ink-muted">
                    {row.correct}/{row.attempted} · {formatPercent(row.accuracy)}
                  </span>
                </div>
                <ProgressBar
                  value={row.accuracy}
                  className="mt-2"
                  label={`${row.domain} accuracy`}
                />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div>
        <SectionHeading title={`Every question (${total})`} />
        <ol className="space-y-4">
          {review.questions.map((question, index) => {
            const result = resultFor(question.id);
            const chosen = result?.answer ?? null;
            const chosenChoice = question.choices.find((choice) => choice.id === chosen);
            const correctChoice = question.choices.find(
              (choice) => choice.id === question.correctAnswer,
            );
            const isSpr = question.type === "student_produced_response";
            const status = !chosen ? "skipped" : result?.correct ? "correct" : "incorrect";

            return (
              <li key={question.id}>
                <Card>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-input border border-line text-meta tabular-nums text-ink-muted">
                        {index + 1}
                      </span>
                      <StatusPill status={status} />
                      <DomainBadge domain={question.domain} />
                      <DifficultyBadge difficulty={question.difficulty} />
                      <span className="text-meta text-ink-muted">{question.skill}</span>
                      <span className="ml-auto inline-flex items-center gap-1 text-meta tabular-nums text-ink-muted">
                        {result?.flagged ? (
                          <Flag size={16} className="text-flagged" aria-label="Flagged" />
                        ) : null}
                        <Clock size={16} aria-hidden />
                        {formatDuration(result?.timeSpentSeconds ?? 0)}
                      </span>
                    </div>

                    {question.passage ? (
                      <details className="rounded-input border border-line bg-paper p-3">
                        <summary className="cursor-pointer text-meta text-ink-muted">
                          Show the passage
                        </summary>
                        <div className="passage mt-3 space-y-3 text-ink">
                          {question.passage.split("\n\n").map((paragraph, pIndex) => (
                            <p key={pIndex} className="whitespace-pre-line">
                              {paragraph}
                            </p>
                          ))}
                          {question.passageSecondary
                            ? question.passageSecondary.split("\n\n").map((paragraph, pIndex) => (
                                <p key={`s-${pIndex}`} className="whitespace-pre-line">
                                  {paragraph}
                                </p>
                              ))
                            : null}
                        </div>
                      </details>
                    ) : null}

                    {question.table ? <QuestionTableBlock table={question.table} /> : null}
                    {question.figure ? <QuestionFigureBlock figure={question.figure} /> : null}
                    {question.expression ? <MathExpression expression={question.expression} /> : null}

                    <p className="text-body text-ink">{question.stem}</p>

                    <dl className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-input border border-line p-3">
                        <dt className="text-label uppercase tracking-[0.04em] text-ink-muted">
                          Your answer
                        </dt>
                        <dd
                          className={cn(
                            "mt-1 text-[14px]",
                            status === "correct" && "text-correct",
                            status === "incorrect" && "text-incorrect",
                            status === "skipped" && "text-ink-muted",
                          )}
                        >
                          {!chosen
                            ? "Skipped"
                            : isSpr
                              ? chosen
                              : `${chosenChoice?.label}. ${chosenChoice?.text}`}
                        </dd>
                      </div>
                      <div className="rounded-input border border-line p-3">
                        <dt className="text-label uppercase tracking-[0.04em] text-ink-muted">
                          Correct answer
                        </dt>
                        <dd className="mt-1 text-[14px] text-ink">
                          {isSpr
                            ? question.correctAnswer
                            : `${correctChoice?.label}. ${correctChoice?.text}`}
                        </dd>
                      </div>
                    </dl>

                    <div>
                      <h3 className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
                        Explanation
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink">
                        {question.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/practice"
          className="rounded-input border border-line px-4 py-2 text-[14px] text-ink transition-ui hover:border-ink-muted"
        >
          Back to practice
        </Link>
        <Link
          href="/progress"
          className="rounded-input border border-line px-4 py-2 text-[14px] text-ink transition-ui hover:border-ink-muted"
        >
          See long-term progress
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: "correct" | "incorrect" | "skipped" }) {
  const meta = {
    correct: { icon: Check, label: "Correct", className: "text-correct border-correct" },
    incorrect: { icon: X, label: "Incorrect", className: "text-incorrect border-incorrect" },
    skipped: { icon: Minus, label: "Skipped", className: "text-ink-muted border-line" },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-badge font-medium uppercase tracking-[0.04em]",
        meta.className,
      )}
    >
      <meta.icon size={16} aria-hidden />
      {meta.label}
    </span>
  );
}

/** Mirrors the grading used on the test screen, for the live-attempt overlay. */
function isCorrect(
  question: SessionReview["questions"][number] | undefined,
  answer: string,
): boolean {
  if (!question) return false;
  if (question.type !== "student_produced_response") return answer === question.correctAnswer;

  const normalize = (value: string) => value.trim().replace(/\s/g, "").replace(/−/g, "-");
  const candidates = [question.correctAnswer, ...(question.acceptedAnswers ?? [])].map(normalize);
  const given = normalize(answer);
  if (candidates.includes(given)) return true;

  const toNumber = (value: string) => {
    const fraction = value.match(/^(-?\d+)\/(\d+)$/);
    if (fraction) return Number(fraction[1]) / Number(fraction[2]);
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const givenNumber = toNumber(given);
  if (givenNumber === null) return false;
  return candidates.some((candidate) => {
    const candidateNumber = toNumber(candidate);
    return candidateNumber !== null && Math.abs(candidateNumber - givenNumber) < 1e-9;
  });
}
