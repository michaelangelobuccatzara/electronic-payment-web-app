import type { GradingPeriod } from "../types/types";

/** "2nd Semester" + "Midterms" -> "2nd Semester - Midterms" */
export function getPeriodName(period: Pick<GradingPeriod, "semester" | "milestone">): string {
  return `${period.semester} - ${period.milestone}`;
}

/** "Feb 10, 2025" (or an existing "2025-02-10") -> "2025-02-10" for <input type="date">. */
export function toDateInputValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** (2026, 2027) -> "AY 2026–2027" */
export function formatAcademicYear(from: number, to: number): string {
  return `AY ${from}–${to}`;
}