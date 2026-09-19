import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * Math is rendered the way the real test displays it: on its own line, in the
 * serif face, with variables italic and digits and operators upright.
 *
 * The notation is deliberately tiny rather than a LaTeX dependency — the design
 * brief allows exactly two typefaces and no third rendering library:
 *   - a single Latin letter is a variable and renders italic
 *   - `^` starts a superscript; `^(...)` groups a multi-character one
 *   - a newline starts a new line of the expression (systems of equations)
 */

interface Token {
  text: string;
  italic: boolean;
  superscript?: Token[];
}

const LETTER = /[A-Za-z]/;

function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;

  while (index < line.length) {
    const char = line[index];

    if (char === "^") {
      index += 1;
      let raw = "";
      if (line[index] === "(") {
        let depth = 1;
        index += 1;
        while (index < line.length && depth > 0) {
          if (line[index] === "(") depth += 1;
          else if (line[index] === ")") depth -= 1;
          if (depth > 0) raw += line[index];
          index += 1;
        }
      } else {
        while (index < line.length && /[A-Za-z0-9]/.test(line[index])) {
          raw += line[index];
          index += 1;
        }
      }
      const previous = tokens[tokens.length - 1];
      if (previous) previous.superscript = tokenizeLine(raw);
      else tokens.push({ text: "", italic: false, superscript: tokenizeLine(raw) });
      continue;
    }

    if (LETTER.test(char)) {
      // A run of letters longer than one character is a function name or word
      // (sin, cos, log), which stays upright.
      let run = "";
      while (index < line.length && LETTER.test(line[index])) {
        run += line[index];
        index += 1;
      }
      tokens.push({ text: run, italic: run.length === 1 });
      continue;
    }

    let run = "";
    while (index < line.length && !LETTER.test(line[index]) && line[index] !== "^") {
      run += line[index];
      index += 1;
    }
    tokens.push({ text: run, italic: false });
  }

  return tokens;
}

function renderTokens(tokens: Token[], keyPrefix: string) {
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-${index}`;
    const body = token.italic ? <i>{token.text}</i> : token.text;
    return (
      <Fragment key={key}>
        {body}
        {token.superscript ? (
          <sup className="text-[0.72em]">{renderTokens(token.superscript, `${key}-sup`)}</sup>
        ) : null}
      </Fragment>
    );
  });
}

export function MathExpression({
  expression,
  className,
  block = true,
}: {
  expression: string;
  className?: string;
  /** Inline is used inside answer choices; block is the default. */
  block?: boolean;
}) {
  const lines = expression.split("\n");
  const content = lines.map((line, index) => (
    <span key={index} className={cn(block && "block")}>
      {renderTokens(tokenizeLine(line), `l${index}`)}
    </span>
  ));

  if (!block) {
    return <span className={cn("font-serif text-[17px] text-ink", className)}>{content}</span>;
  }

  return (
    <div className={cn("my-4 font-serif text-[19px] leading-relaxed text-ink", className)}>
      {content}
    </div>
  );
}
