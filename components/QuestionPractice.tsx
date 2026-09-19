"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import type { QuestionWithState } from "@/lib/types";
import { QuestionViewer, PassagePane } from "@/components/QuestionViewer";
import { ChoiceList, ResponseInput, type ChoiceTone } from "@/components/ChoiceList";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Normalizes an SPR entry so "0.5", ".5" and "1/2" all count as the same answer. */
function matchesSpr(question: QuestionWithState, entry: string): boolean {
  const normalize = (value: string) => value.trim().replace(/\s/g, "").replace(/−/g, "-");
  const candidates = [question.correctAnswer, ...(question.acceptedAnswers ?? [])].map(normalize);
  const given = normalize(entry);
  if (candidates.includes(given)) return true;

  // Fall back to a numeric comparison so equivalent forms are accepted.
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

/**
 * The full question view used by the question bank: answer, submit, then the
 * correct answer and explanation are revealed. Stage 2 records the attempt;
 * Stage 1 keeps it in component state.
 */
export function QuestionPractice({ question }: { question: QuestionWithState }) {
  const isSpr = question.type === "student_produced_response";
  const [choice, setChoice] = useState<string | null>(null);
  const [entry, setEntry] = useState("");
  const [crossedOut, setCrossedOut] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const answered = isSpr ? entry.trim().length > 0 : choice !== null;
  const correct = isSpr
    ? matchesSpr(question, entry)
    : choice === question.correctAnswer;

  const toneFor = (choiceId: string): ChoiceTone => {
    if (!submitted) return "default";
    if (choiceId === question.correctAnswer) return "correct";
    if (choiceId === choice) return "incorrect";
    return "default";
  };

  const reset = () => {
    setChoice(null);
    setEntry("");
    setCrossedOut([]);
    setSubmitted(false);
  };

  const body = (
    <QuestionViewer question={question}>
      <div className="pt-2">
        {isSpr ? (
          <ResponseInput value={entry} onChange={setEntry} disabled={submitted} />
        ) : (
          <ChoiceList
            name={question.id}
            choices={question.choices}
            value={choice}
            onChange={setChoice}
            crossedOut={crossedOut}
            onToggleCrossOut={
              submitted
                ? undefined
                : (id) =>
                    setCrossedOut((current) =>
                      current.includes(id)
                        ? current.filter((item) => item !== id)
                        : [...current, id],
                    )
            }
            disabled={submitted}
            toneFor={toneFor}
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {submitted ? (
          <Button variant="secondary" onClick={reset}>
            Try again
          </Button>
        ) : (
          <Button variant="primary" disabled={!answered} onClick={() => setSubmitted(true)}>
            Submit answer
          </Button>
        )}
      </div>

      {submitted ? (
        <div
          role="status"
          className="mt-4 space-y-4 rounded-card border border-line bg-paper p-6"
        >
          <p
            className={cn(
              "flex items-center gap-2 text-[15px] font-medium",
              correct ? "text-correct" : "text-incorrect",
            )}
          >
            {correct ? <Check size={20} aria-hidden /> : <X size={20} aria-hidden />}
            {correct ? "Correct" : "Not quite"}
          </p>

          {!correct ? (
            <p className="text-[14px] text-ink">
              <span className="text-ink-muted">Correct answer: </span>
              {isSpr
                ? question.correctAnswer
                : question.choices.find((item) => item.id === question.correctAnswer)?.label}
              {!isSpr
                ? `. ${question.choices.find((item) => item.id === question.correctAnswer)?.text}`
                : null}
            </p>
          ) : null}

          <div>
            <h3 className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
              Explanation
            </h3>
            <p className="mt-2 text-[14px] leading-relaxed text-ink">{question.explanation}</p>
          </div>
        </div>
      ) : null}
    </QuestionViewer>
  );

  // Reading and Writing keeps the passage beside the question, as in the test.
  if (question.section === "rw" && question.passage) {
    return (
      <div className="grid gap-8 lg:grid-cols-2 lg:divide-x lg:divide-line">
        <div className="lg:pr-8">
          <PassagePane question={question} />
        </div>
        <div className="lg:pl-8">{body}</div>
      </div>
    );
  }

  return <div className="max-w-[720px]">{body}</div>;
}
