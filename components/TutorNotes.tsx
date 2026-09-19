"use client";

import { useState } from "react";
import type { StudentNote } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/lib/utils";

/**
 * Tutor notes. Adding a note appends to local state only; Stage 2 writes it to
 * a `student_notes` table visible to that student's tutors alone.
 */
export function TutorNotes({
  notes: initialNotes,
  author,
  studentId,
}: {
  notes: StudentNote[];
  author: string;
  studentId: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [draft, setDraft] = useState("");

  const addNote = (event: React.FormEvent) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    setNotes((current) => [
      {
        id: `local-${current.length + 1}`,
        studentId,
        author,
        createdAt: new Date().toISOString(),
        body,
      },
      ...current,
    ]);
    setDraft("");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={addNote} className="space-y-3">
        <label htmlFor="note-body" className="block text-label font-medium uppercase tracking-[0.04em] text-ink-muted">
          Add a note
        </label>
        <Textarea
          id="note-body"
          rows={4}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="What did you observe, and what are you changing because of it?"
        />
        <div className="flex items-center gap-4">
          <Button type="submit" variant="primary" size="sm" disabled={draft.trim().length === 0}>
            Save note
          </Button>
          <span className="text-meta text-ink-muted">
            Notes are private to tutors. Not persisted in Stage 1.
          </span>
        </div>
      </form>

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          description="Anything you record here stays with the student's profile."
        />
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
              <p className="text-meta text-ink-muted">
                {note.author} · {formatDate(note.createdAt)}
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink">{note.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
