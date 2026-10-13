import type { GradingPeriod } from "../types/types";

/** "2nd Semester" + "Midterms" -> "2nd Semester - Midterms" */
export function getPeriodName(period: Pick<GradingPeriod, "semester" | "milestone">): string {
  return `${period.semester} - ${period.milestone}`;
}