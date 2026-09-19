"use client";

import type { ActivityDay } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * A year of study activity. Built by hand rather than with recharts, since this
 * is a grid of cells rather than a plot. Magnitude is one hue stepped from
 * --line to --accent, which is the sequential rule: one hue, light to dark.
 */

const WEEKDAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];

function level(questions: number): 0 | 1 | 2 | 3 | 4 {
  if (questions === 0) return 0;
  if (questions < 10) return 1;
  if (questions < 20) return 2;
  if (questions < 32) return 3;
  return 4;
}

const LEVEL_STYLE: Record<number, string> = {
  0: "bg-line/50",
  1: "bg-accent/25",
  2: "bg-accent/45",
  3: "bg-accent/70",
  4: "bg-accent",
};

export function CalendarHeatmap({ days }: { days: ActivityDay[] }) {
  if (days.length === 0) return null;

  // Pad the start so every column is a full Monday-to-Sunday week.
  const firstDate = new Date(`${days[0].date}T12:00:00.000Z`);
  const leadingBlanks = (firstDate.getUTCDay() + 6) % 7;

  const cells: (ActivityDay | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...days,
  ];

  const weeks: (ActivityDay | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7));
  }

  const monthLabels = weeks.map((week) => {
    const firstOfWeek = week.find(Boolean);
    if (!firstOfWeek) return "";
    const date = new Date(`${firstOfWeek.date}T12:00:00.000Z`);
    return date.getUTCDate() <= 7
      ? date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })
      : "";
  });

  const total = days.reduce((sum, day) => sum + day.questions, 0);
  const activeDays = days.filter((day) => day.questions > 0).length;

  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="inline-flex gap-2">
          <div className="flex shrink-0 flex-col gap-[3px] pt-[18px]">
            {WEEKDAY_LABELS.map((label, index) => (
              <span
                key={index}
                className="flex h-[11px] items-center text-[9px] leading-none text-ink-muted"
              >
                {label}
              </span>
            ))}
          </div>

          <div>
            <div className="mb-1 flex gap-[3px]">
              {monthLabels.map((label, index) => (
                <span key={index} className="w-[11px] text-[9px] leading-none text-ink-muted">
                  {label}
                </span>
              ))}
            </div>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      title={
                        day
                          ? `${day.questions} question${day.questions === 1 ? "" : "s"} on ${day.date}`
                          : undefined
                      }
                      className={cn(
                        "h-[11px] w-[11px] rounded-[2px]",
                        day ? LEVEL_STYLE[level(day.questions)] : "bg-transparent",
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-meta text-ink-muted">
        <span className="tabular-nums">
          {total.toLocaleString("en-GB")} questions over {activeDays} active days
        </span>
        <span className="flex items-center gap-2">
          Less
          {[0, 1, 2, 3, 4].map((step) => (
            <span key={step} className={cn("h-[11px] w-[11px] rounded-[2px]", LEVEL_STYLE[step])} />
          ))}
          More
        </span>
      </div>
    </div>
  );
}
