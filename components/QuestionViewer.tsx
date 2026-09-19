import type { Question, QuestionFigure, QuestionTable } from "@/lib/types";
import { MathExpression } from "@/components/MathExpression";
import { cn } from "@/lib/utils";

/** Reading and Writing stimulus: Newsreader 17px/1.7, capped at 62ch. */
export function PassagePane({
  question,
  className,
}: {
  question: Pick<Question, "passage" | "passageSecondary">;
  className?: string;
}) {
  if (!question.passage) return null;
  return (
    <div className={cn("space-y-6", className)}>
      <Passage text={question.passage} />
      {question.passageSecondary ? <Passage text={question.passageSecondary} /> : null}
    </div>
  );
}

function Passage({ text }: { text: string }) {
  const paragraphs = text.split("\n\n");
  return (
    <div className="passage space-y-4 text-ink">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function QuestionTableBlock({ table }: { table: QuestionTable }) {
  return (
    <figure className="my-4 overflow-x-auto">
      {table.caption ? (
        <figcaption className="mb-2 text-meta text-ink-muted">{table.caption}</figcaption>
      ) : null}
      <table className="w-full border-collapse text-meta">
        <thead className="border-b border-ink">
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-3 py-2 text-left text-label font-medium uppercase tracking-[0.04em] text-ink-muted"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-3 py-2 tabular-nums text-ink">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/**
 * Stage 1 ships no binary assets, so a figure renders as a described
 * placeholder. Stage 2 adds a URL to the type and swaps the box for the image
 * without changing any caller.
 */
export function QuestionFigureBlock({ figure }: { figure: QuestionFigure }) {
  return (
    <figure className="my-4">
      <div
        role="img"
        aria-label={figure.alt}
        className="flex min-h-[160px] items-center justify-center rounded-input border border-dashed border-line bg-paper px-6 py-8 text-center"
      >
        <span className="max-w-[48ch] text-meta text-ink-muted">{figure.alt}</span>
      </div>
      {figure.caption ? (
        <figcaption className="mt-2 text-meta text-ink-muted">{figure.caption}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * The question side of the screen: stimulus blocks, the expression on its own
 * line, then the stem. Answer controls are passed in as children so the same
 * viewer serves the test screen, the question bank and the review page.
 */
export function QuestionViewer({
  question,
  children,
  header,
  className,
}: {
  question: Question;
  children?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {header}
      {question.table ? <QuestionTableBlock table={question.table} /> : null}
      {question.figure ? <QuestionFigureBlock figure={question.figure} /> : null}
      {question.expression ? <MathExpression expression={question.expression} /> : null}
      <p className="text-body text-ink">{question.stem}</p>
      {children}
    </div>
  );
}
