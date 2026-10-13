import type { GradingPeriod, GradingPeriodsSummary } from "../types/types";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_GRADING_PERIODS: readonly GradingPeriod[] = [
  { id: "ay2425-s2-midterms", academicYear: "AY 2024–2025", semester: "2nd Semester", milestone: "Midterms", dueDate: "Feb 10, 2025", status: "current" },
  { id: "ay2425-s2-prelims", academicYear: "AY 2024–2025", semester: "2nd Semester", milestone: "Prelims", dueDate: "Jan 06, 2025", status: "past" },
  { id: "ay2425-s2-finals", academicYear: "AY 2024–2025", semester: "2nd Semester", milestone: "Finals", dueDate: "Apr 16, 2025", status: "upcoming" },
  { id: "ay2425-s1-finals", academicYear: "AY 2024–2025", semester: "1st Semester", milestone: "Finals", dueDate: "Nov 15, 2024", status: "past" },
  { id: "ay2425-s1-midterms", academicYear: "AY 2024–2025", semester: "1st Semester", milestone: "Midterms", dueDate: "Sep 20, 2024", status: "past" },
];

export const SAMPLE_GRADING_SUMMARY: GradingPeriodsSummary = {
  configuredTerms: 5,
  coverageLabel: "AY 24-25 Full",
};