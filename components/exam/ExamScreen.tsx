"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Flag,
  Grid3x3,
} from "lucide-react";
import type { Question, TestSession } from "@/lib/types";
import { SECTION_LABELS } from "@/lib/taxonomy";
import { Timer, useCountdown } from "@/components/Timer";
import { QuestionNavigator, type NavigatorItem } from "@/components/QuestionNavigator";
import { ChoiceList, ResponseInput } from "@/components/ChoiceList";
import { MathExpression } from "@/components/MathExpression";
import { QuestionFigureBlock, QuestionTableBlock } from "@/components/QuestionViewer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ReferenceSheet } from "./ReferenceSheet";
import { CalculatorPanel } from "./CalculatorPanel";
import { AnnotatedPassage } from "./AnnotatedPassage";
import { saveAttempt } from "@/lib/session-store";
import { cn } from "@/lib/utils";

/* ---------------------------------- state --------------------------------- */

interface ExamState {
  moduleIndex: number;
  questionIndex: number;
  answers: Record<string, string>;
  flags: Record<string, boolean>;
  crossedOut: Record<string, string[]>;
  highlights: Record<string, string[]>;
  /** Shown between modules, as the real test does. */
  atBreak: boolean;
  finished: boolean;
  elapsed: Record<string, number>;
}

type ExamAction =
  | { type: "answer"; questionId: string; value: string }
  | { type: "toggleFlag"; questionId: string }
  | { type: "toggleCrossOut"; questionId: string; choiceId: string }
  | { type: "addHighlight"; questionId: string; snippet: string }
  | { type: "clearHighlights"; questionId: string }
  | { type: "goTo"; index: number }
  | { type: "next"; moduleCount: number; questionCount: number }
  | { type: "back" }
  | { type: "startNextModule" }
  | { type: "finish" }
  | { type: "tick"; questionId: string };

function reducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "answer":
      return { ...state, answers: { ...state.answers, [action.questionId]: action.value } };

    case "toggleFlag":
      return {
        ...state,
        flags: { ...state.flags, [action.questionId]: !state.flags[action.questionId] },
      };

    case "toggleCrossOut": {
      const current = state.crossedOut[action.questionId] ?? [];
      const next = current.includes(action.choiceId)
        ? current.filter((id) => id !== action.choiceId)
        : [...current, action.choiceId];
      return { ...state, crossedOut: { ...state.crossedOut, [action.questionId]: next } };
    }

    case "addHighlight": {
      const current = state.highlights[action.questionId] ?? [];
      if (current.includes(action.snippet)) return state;
      return {
        ...state,
        highlights: { ...state.highlights, [action.questionId]: [...current, action.snippet] },
      };
    }

    case "clearHighlights":
      return { ...state, highlights: { ...state.highlights, [action.questionId]: [] } };

    case "goTo":
      return { ...state, questionIndex: action.index };

    case "next": {
      if (state.questionIndex < action.questionCount - 1) {
        return { ...state, questionIndex: state.questionIndex + 1 };
      }
      // End of a module: break first, then the next module, or finish.
      if (state.moduleIndex < action.moduleCount - 1) return { ...state, atBreak: true };
      return { ...state, finished: true };
    }

    case "back":
      return { ...state, questionIndex: Math.max(0, state.questionIndex - 1) };

    case "startNextModule":
      return { ...state, atBreak: false, moduleIndex: state.moduleIndex + 1, questionIndex: 0 };

    case "finish":
      return { ...state, finished: true };

    case "tick":
      return {
        ...state,
        elapsed: {
          ...state.elapsed,
          [action.questionId]: (state.elapsed[action.questionId] ?? 0) + 1,
        },
      };

    default:
      return state;
  }
}

/* --------------------------------- screen --------------------------------- */

export function ExamScreen({
  session,
  questions,
  studentName,
  drillOverride,
}: {
  session: TestSession;
  questions: Question[];
  studentName: string;
  /** Drill configuration carried in the query string from the practice hub. */
  drillOverride?: { skill: string; count: number; timed: boolean };
}) {
  const router = useRouter();
  const byId = useMemo(
    () => new Map(questions.map((question) => [question.id, question])),
    [questions],
  );

  const modules = session.modules;
  const [state, dispatch] = useReducer(reducer, {
    moduleIndex: 0,
    questionIndex: 0,
    answers: {},
    flags: {},
    crossedOut: {},
    highlights: {},
    atBreak: false,
    finished: false,
    elapsed: {},
  });

  const [timerHidden, setTimerHidden] = useState(false);
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [navigatorOpen, setNavigatorOpen] = useState(false);

  const currentModule = modules[state.moduleIndex];
  const moduleQuestionIds = currentModule?.questionIds ?? [];
  const currentQuestionId = moduleQuestionIds[state.questionIndex];
  const question = currentQuestionId ? byId.get(currentQuestionId) : undefined;

  const timed = drillOverride ? drillOverride.timed : session.timed;
  const moduleSeconds = currentModule?.durationSeconds || moduleQuestionIds.length * 75;
  const remaining = useCountdown(moduleSeconds, timed && !state.atBreak && !state.finished);

  // Per-question time on task, for the review page.
  useEffect(() => {
    if (!currentQuestionId || state.atBreak || state.finished) return;
    const id = window.setInterval(() => {
      dispatch({ type: "tick", questionId: currentQuestionId });
    }, 1000);
    return () => window.clearInterval(id);
  }, [currentQuestionId, state.atBreak, state.finished]);

  // Running out of time moves the test on, exactly as the real one does.
  useEffect(() => {
    if (!timed || remaining > 0 || state.atBreak || state.finished) return;
    dispatch({ type: "next", moduleCount: modules.length, questionCount: moduleQuestionIds.length });
  }, [timed, remaining, state.atBreak, state.finished, modules.length, moduleQuestionIds.length]);

  const finish = useCallback(() => {
    saveAttempt({
      sessionId: session.id,
      answers: state.answers,
      flags: state.flags,
      timeSpent: state.elapsed,
      completedAt: new Date().toISOString(),
    });
    router.push(`/review/${session.id}`);
  }, [router, session.id, state.answers, state.flags, state.elapsed]);

  useEffect(() => {
    if (state.finished) finish();
  }, [state.finished, finish]);

  const navigatorItems: NavigatorItem[] = moduleQuestionIds.map((id, index) => ({
    index,
    questionId: id,
    answered: Boolean(state.answers[id]),
    flagged: Boolean(state.flags[id]),
  }));

  const answeredCount = navigatorItems.filter((item) => item.answered).length;

  /* ------------------------------ break screen ----------------------------- */

  if (state.atBreak) {
    const nextModule = modules[state.moduleIndex + 1];
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <div className="w-full max-w-[520px] rounded-card border border-line bg-surface p-8 text-center">
          <p className="text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
            Module complete
          </p>
          <h1 className="mt-3 text-[24px] font-semibold text-ink">
            {SECTION_LABELS[currentModule.section]} · {currentModule.label} finished
          </h1>
          <p className="mt-3 text-[14px] text-ink-muted">
            You answered {answeredCount} of {moduleQuestionIds.length} questions. The next module
            is {SECTION_LABELS[nextModule.section]} {nextModule.label}, with{" "}
            {nextModule.questionIds.length} questions in{" "}
            {Math.round(nextModule.durationSeconds / 60)} minutes. You cannot return to the
            previous module.
          </p>
          <Button
            variant="primary"
            size="lg"
            className="mt-8 w-full"
            onClick={() => dispatch({ type: "startNextModule" })}
          >
            Start {nextModule.label}
          </Button>
        </div>
      </div>
    );
  }

  if (!question || !currentModule) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <p className="text-[14px] text-ink-muted">Preparing your session…</p>
      </div>
    );
  }

  const isRw = question.section === "rw";
  const crossedOut = state.crossedOut[question.id] ?? [];
  const highlights = state.highlights[question.id] ?? [];
  const isLastQuestion =
    state.moduleIndex === modules.length - 1 &&
    state.questionIndex === moduleQuestionIds.length - 1;

  /* ----------------------------- question panel ---------------------------- */

  const questionPanel = (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-line pb-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-input bg-ink text-meta tabular-nums text-paper">
          {state.questionIndex + 1}
        </span>
        <button
          type="button"
          onClick={() => dispatch({ type: "toggleFlag", questionId: question.id })}
          aria-pressed={Boolean(state.flags[question.id])}
          className={cn(
            "inline-flex items-center gap-2 rounded-input border px-3 py-1.5 text-meta transition-ui",
            state.flags[question.id]
              ? "border-flagged text-flagged"
              : "border-line text-ink-muted hover:border-ink-muted hover:text-ink",
          )}
        >
          <Flag size={16} aria-hidden />
          {state.flags[question.id] ? "Marked for review" : "Mark for review"}
        </button>
      </div>

      {question.table ? <QuestionTableBlock table={question.table} /> : null}
      {question.figure ? <QuestionFigureBlock figure={question.figure} /> : null}
      {question.expression ? <MathExpression expression={question.expression} /> : null}

      <p className="text-body text-ink">{question.stem}</p>

      {question.type === "student_produced_response" ? (
        <ResponseInput
          id={`spr-${question.id}`}
          value={state.answers[question.id] ?? ""}
          onChange={(value) => dispatch({ type: "answer", questionId: question.id, value })}
        />
      ) : (
        <ChoiceList
          name={question.id}
          choices={question.choices}
          value={state.answers[question.id] ?? null}
          onChange={(value) => dispatch({ type: "answer", questionId: question.id, value })}
          crossedOut={crossedOut}
          onToggleCrossOut={(choiceId) =>
            dispatch({ type: "toggleCrossOut", questionId: question.id, choiceId })
          }
        />
      )}
    </div>
  );

  return (
    <div className="flex h-screen flex-col bg-paper">
      {/* Fixed 56px top bar. */}
      <header className="flex h-[56px] shrink-0 items-center justify-between gap-4 border-b border-line bg-surface px-4 lg:px-6">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-medium text-ink">
            {SECTION_LABELS[currentModule.section]}
            <span className="text-ink-muted"> · {currentModule.label}</span>
          </p>
          <p className="text-meta text-ink-muted">
            {drillOverride ? `${drillOverride.skill} drill` : session.title}
          </p>
        </div>

        {timed ? (
          <Timer
            secondsRemaining={remaining}
            hidden={timerHidden}
            onToggleHidden={() => setTimerHidden((current) => !current)}
          />
        ) : (
          <span className="text-meta text-ink-muted">Untimed</span>
        )}

        <div className="flex items-center gap-2">
          {question.section === "math" ? (
            <>
              <button
                type="button"
                onClick={() => setCalculatorOpen((current) => !current)}
                aria-pressed={calculatorOpen}
                className="inline-flex items-center gap-2 rounded-input border border-line px-3 py-1.5 text-meta text-ink-muted transition-ui hover:border-ink-muted hover:text-ink"
              >
                <Calculator size={16} aria-hidden />
                <span className="hidden sm:inline">Calculator</span>
              </button>
              <ReferenceSheet
                trigger={
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-input border border-line px-3 py-1.5 text-meta text-ink-muted transition-ui hover:border-ink-muted hover:text-ink"
                  >
                    <BookOpen size={16} aria-hidden />
                    <span className="hidden sm:inline">Reference</span>
                  </button>
                }
              />
            </>
          ) : null}
          <span className="hidden text-meta tabular-nums text-ink-muted md:inline">
            Question {state.questionIndex + 1} of {moduleQuestionIds.length}
          </span>
        </div>
      </header>

      {/* Content between the bars. */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {isRw && question.passage ? (
          // Reading and Writing: 50/50 split with a 1px divider down the middle.
          <div className="mx-auto grid h-full max-w-[1400px] grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line lg:px-0">
            <div className="lg:overflow-y-auto lg:px-8">
              <AnnotatedPassage
                text={
                  question.passageSecondary
                    ? `${question.passage}\n\n${question.passageSecondary}`
                    : question.passage
                }
                highlights={highlights}
                onAdd={(snippet) =>
                  dispatch({ type: "addHighlight", questionId: question.id, snippet })
                }
                onClear={() => dispatch({ type: "clearHighlights", questionId: question.id })}
              />
            </div>
            <div className="lg:overflow-y-auto lg:px-8">{questionPanel}</div>
          </div>
        ) : (
          // Math: a single 720px centred column, with the calculator beside it.
          <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-8 lg:flex-row lg:justify-center">
            <div className="w-full max-w-[720px]">{questionPanel}</div>
            {calculatorOpen ? <CalculatorPanel onClose={() => setCalculatorOpen(false)} /> : null}
          </div>
        )}
      </div>

      {/* Fixed 64px bottom bar. */}
      <footer className="flex h-[64px] shrink-0 items-center justify-between gap-4 border-t border-line bg-surface px-4 lg:px-6">
        <span className="hidden truncate text-meta text-ink-muted sm:block sm:flex-1">
          {studentName}
        </span>

        <Popover open={navigatorOpen} onOpenChange={setNavigatorOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-input border border-line px-4 py-2 text-[14px] text-ink transition-ui hover:border-ink-muted"
            >
              <Grid3x3 size={16} aria-hidden />
              Question {state.questionIndex + 1} of {moduleQuestionIds.length}
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-[340px]">
            <QuestionNavigator
              items={navigatorItems}
              current={state.questionIndex}
              onSelect={(index) => {
                dispatch({ type: "goTo", index });
                setNavigatorOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-1 items-center justify-end gap-3">
          <Button
            variant="secondary"
            onClick={() => dispatch({ type: "back" })}
            disabled={state.questionIndex === 0}
          >
            <ChevronLeft size={16} />
            Back
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              dispatch({
                type: "next",
                moduleCount: modules.length,
                questionCount: moduleQuestionIds.length,
              })
            }
          >
            {isLastQuestion ? "Finish" : "Next"}
            {isLastQuestion ? null : <ChevronRight size={16} />}
          </Button>
        </div>
      </footer>
    </div>
  );
}
