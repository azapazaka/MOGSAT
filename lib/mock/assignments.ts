import type { Assignment, StudentNote } from "../types";
import { daysAfter, daysBefore } from "./clock";

/** Work set by the two tutors, some overdue, some already submitted. */
export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: "as-01",
    title: "Circles and coordinate geometry",
    instructions:
      "Work through the set untimed. Write out the completing-the-square step in full, even when you can see the answer.",
    createdBy: "tutor-1",
    createdAt: daysBefore(6),
    dueDate: daysAfter(1),
    assigneeIds: ["s-01", "s-05", "s-07"],
    source: {
      kind: "skill",
      skill: "Circles",
      domain: "Geometry and Trigonometry",
      section: "math",
      questionCount: 12,
    },
    completion: [
      { studentId: "s-01", completed: 9, total: 12 },
      { studentId: "s-05", completed: 12, total: 12, submittedAt: daysBefore(2) },
      { studentId: "s-07", completed: 3, total: 12 },
    ],
  },
  {
    id: "as-02",
    title: "Transitions: weekly set",
    instructions: "Timed. Aim for under 45 seconds per question.",
    createdBy: "tutor-1",
    createdAt: daysBefore(3),
    dueDate: daysAfter(4),
    assigneeIds: ["s-01", "s-02", "s-05", "s-07"],
    groupLabel: "November test group",
    source: {
      kind: "skill",
      skill: "Transitions",
      domain: "Expression of Ideas",
      section: "rw",
      questionCount: 20,
    },
    completion: [
      { studentId: "s-01", completed: 20, total: 20, submittedAt: daysBefore(1) },
      { studentId: "s-02", completed: 11, total: 20 },
      { studentId: "s-05", completed: 20, total: 20, submittedAt: daysBefore(2) },
      { studentId: "s-07", completed: 0, total: 20 },
    ],
  },
  {
    id: "as-03",
    title: "Percentages and unit rates",
    createdBy: "tutor-2",
    createdAt: daysBefore(14),
    dueDate: daysBefore(3),
    assigneeIds: ["s-04", "s-08"],
    source: {
      kind: "skill",
      skill: "Percentages",
      domain: "Problem-Solving and Data Analysis",
      section: "math",
      questionCount: 10,
    },
    completion: [
      { studentId: "s-04", completed: 10, total: 10, submittedAt: daysBefore(5) },
      { studentId: "s-08", completed: 2, total: 10 },
    ],
  },
  {
    id: "as-04",
    title: "Boundaries: punctuation review",
    instructions: "Read each sentence aloud before answering. Untimed.",
    createdBy: "tutor-2",
    createdAt: daysBefore(9),
    dueDate: daysAfter(2),
    assigneeIds: ["s-03", "s-06", "s-08"],
    source: {
      kind: "skill",
      skill: "Boundaries",
      domain: "Standard English Conventions",
      section: "rw",
      questionCount: 15,
    },
    completion: [
      { studentId: "s-03", completed: 15, total: 15, submittedAt: daysBefore(7) },
      { studentId: "s-06", completed: 8, total: 15 },
      { studentId: "s-08", completed: 0, total: 15 },
    ],
  },
  {
    id: "as-05",
    title: "Hand-picked: quadratics you missed",
    instructions: "These are the six questions from your last two tests that went wrong.",
    createdBy: "tutor-1",
    createdAt: daysBefore(2),
    dueDate: daysAfter(6),
    assigneeIds: ["s-01"],
    source: {
      kind: "questions",
      questionIds: ["m-adv-02", "m-adv-03", "m-adv-04", "m-adv-05", "m-alg-06", "m-geo-04"],
    },
    completion: [{ studentId: "s-01", completed: 2, total: 6 }],
  },
  {
    id: "as-06",
    title: "Evidence questions: quantitative",
    createdBy: "tutor-2",
    createdAt: daysBefore(1),
    dueDate: daysAfter(9),
    assigneeIds: ["s-03", "s-04", "s-06", "s-08"],
    groupLabel: "Reyes cohort",
    source: {
      kind: "skill",
      skill: "Command of evidence: quantitative",
      domain: "Information and Ideas",
      section: "rw",
      questionCount: 12,
    },
    completion: [
      { studentId: "s-03", completed: 5, total: 12 },
      { studentId: "s-04", completed: 0, total: 12 },
      { studentId: "s-06", completed: 1, total: 12 },
      { studentId: "s-08", completed: 0, total: 12 },
    ],
  },
];

/** Free-text tutor notes shown on the admin student profile. */
export const MOCK_STUDENT_NOTES: StudentNote[] = [
  {
    id: "note-01",
    studentId: "s-01",
    author: "Amara Osei",
    createdAt: daysBefore(5),
    body: "Geometry is the bottleneck, not algebra. She solves circle questions correctly when she writes the completing-the-square step out and rushes them when she doesn't. Set the untimed circles assignment to force the habit.",
  },
  {
    id: "note-02",
    studentId: "s-01",
    author: "Amara Osei",
    createdAt: daysBefore(27),
    body: "Pacing on RW Module 2 improved after we cut her annotation habit down to underlining only. Worth revisiting if accuracy dips.",
  },
  {
    id: "note-03",
    studentId: "s-04",
    author: "Daniel Reyes",
    createdAt: daysBefore(10),
    body: "Missed two sessions in a row. Emailed to reschedule. Percentages set came back fully correct, so the gap is engagement rather than comprehension.",
  },
  {
    id: "note-04",
    studentId: "s-08",
    author: "Daniel Reyes",
    createdAt: daysBefore(16),
    body: "Target of 1520 is a long way from the current estimate with the test two weeks out. Discuss either a later test date or a narrower revision plan at the next call.",
  },
];
