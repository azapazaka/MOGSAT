"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Search } from "lucide-react";
import type { Student, StudentStanding } from "@/lib/types";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/EmptyState";
import { ProgressBar } from "@/components/ProgressRing";
import { formatPercent, formatRelative, signed } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STANDING_LABELS: Record<StudentStanding, string> = {
  on_track: "On track",
  needs_attention: "Needs attention",
  falling_behind: "Falling behind",
};

type SortKey = "name" | "currentScore" | "questionsSolved" | "accuracy" | "lastActiveAt";

const SORTABLE_COLUMNS: { label: string; sortBy: SortKey }[] = [
  { label: "Student", sortBy: "name" },
  { label: "Estimated", sortBy: "currentScore" },
  { label: "Solved", sortBy: "questionsSolved" },
  { label: "Accuracy", sortBy: "accuracy" },
  { label: "Last active", sortBy: "lastActiveAt" },
];

function SortableHeader({
  label,
  sortBy,
  activeKey,
  ascending,
  onSort,
}: {
  label: string;
  sortBy: SortKey;
  activeKey: SortKey;
  ascending: boolean;
  onSort: (key: SortKey) => void;
}) {
  const active = activeKey === sortBy;
  return (
    <TH aria-sort={active ? (ascending ? "ascending" : "descending") : "none"}>
      <button
        type="button"
        onClick={() => onSort(sortBy)}
        className="inline-flex items-center gap-1 uppercase tracking-[0.04em] transition-ui hover:text-ink"
      >
        {label}
        <ArrowUpDown size={16} className={cn(active ? "text-ink" : "text-line")} />
      </button>
    </TH>
  );
}

/** Searchable, sortable cohort table. Rows link to the full student profile. */
export function StudentTable({
  students,
  now,
  assignmentStatus,
}: {
  students: Student[];
  now: number;
  /** "3 of 4 submitted" style summary, keyed by student id. */
  assignmentStatus?: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [ascending, setAscending] = useState(true);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? students.filter(
          (student) =>
            student.name.toLowerCase().includes(needle) ||
            student.email.toLowerCase().includes(needle),
        )
      : students;

    return [...filtered].sort((a, b) => {
      const direction = ascending ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * direction;
      if (sortKey === "lastActiveAt") {
        return (Date.parse(a.lastActiveAt) - Date.parse(b.lastActiveAt)) * direction;
      }
      return (Number(a[sortKey]) - Number(b[sortKey])) * direction;
    });
  }, [students, query, sortKey, ascending]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setAscending((current) => !current);
    else {
      setSortKey(key);
      setAscending(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative max-w-[320px]">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          aria-hidden
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search students"
          aria-label="Search students by name or email"
          className="pl-9"
        />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No students match that search"
          description="Try a different name or clear the search field."
        />
      ) : (
        <Table>
          <THead>
            <TR className="border-b-0">
              {SORTABLE_COLUMNS.slice(0, 1).map((column) => (
                <SortableHeader
                  key={column.sortBy}
                  label={column.label}
                  sortBy={column.sortBy}
                  activeKey={sortKey}
                  ascending={ascending}
                  onSort={toggleSort}
                />
              ))}
              <TH>Target</TH>
              {SORTABLE_COLUMNS.slice(1).map((column) => (
                <SortableHeader
                  key={column.sortBy}
                  label={column.label}
                  sortBy={column.sortBy}
                  activeKey={sortKey}
                  ascending={ascending}
                  onSort={toggleSort}
                />
              ))}
              <TH>Assigned work</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((student) => (
              <TR key={student.id}>
                <TD>
                  <Link
                    href={`/admin/students/${student.id}`}
                    className="font-medium text-ink transition-ui hover:text-accent"
                  >
                    {student.name}
                  </Link>
                  <span className="mt-0.5 block text-meta text-ink-muted">
                    {STANDING_LABELS[student.standing]}
                  </span>
                </TD>
                <TD className="tabular-nums text-ink-muted">{student.targetScore}</TD>
                <TD>
                  <span className="tabular-nums">{student.currentScore}</span>
                  <span
                    className={cn(
                      "ml-2 text-meta tabular-nums",
                      student.scoreChange30d >= 0 ? "text-correct" : "text-incorrect",
                    )}
                  >
                    {signed(student.scoreChange30d)}
                  </span>
                </TD>
                <TD className="tabular-nums">{student.questionsSolved.toLocaleString("en-GB")}</TD>
                <TD>
                  <span className="tabular-nums">{formatPercent(student.accuracy)}</span>
                  <ProgressBar
                    value={student.accuracy}
                    className="mt-1 w-16"
                    label={`${student.name} accuracy`}
                  />
                </TD>
                <TD className="text-ink-muted">{formatRelative(student.lastActiveAt, now)}</TD>
                <TD className="text-ink-muted">{assignmentStatus?.[student.id] ?? "—"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  );
}
