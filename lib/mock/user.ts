import type { UserProfile } from "../types";
import { MOCK_STUDENTS, MOCK_TUTORS } from "./students";

/**
 * Stage 1 has no auth. The dev role switcher picks one of these two identities,
 * and `getCurrentUser()` in the data layer returns the matching profile.
 * Stage 2 replaces both with the Supabase session user.
 */

const demoStudent = MOCK_STUDENTS[0];
const demoTutor = MOCK_TUTORS[0];

export const MOCK_STUDENT_USER: UserProfile = {
  id: demoStudent.id,
  name: demoStudent.name,
  email: demoStudent.email,
  role: "student",
  studentId: demoStudent.id,
  targetScore: demoStudent.targetScore,
  testDate: demoStudent.testDate,
  timeZone: "Europe/London",
  notifications: {
    studyReminders: true,
    weeklyReport: true,
    assignmentAlerts: true,
    tutorMessages: false,
  },
};

export const MOCK_ADMIN_USER: UserProfile = {
  id: demoTutor.id,
  name: demoTutor.name,
  email: demoTutor.email,
  role: "admin",
  targetScore: 1600,
  testDate: demoStudent.testDate,
  timeZone: "Europe/London",
  notifications: {
    studyReminders: false,
    weeklyReport: true,
    assignmentAlerts: true,
    tutorMessages: true,
  },
};
