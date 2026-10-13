export const YEAR_LEVELS = ["Kinder Garten", "Elementary", "Junior High School", "Senior High School"] as const;
export type YearLevel = (typeof YEAR_LEVELS)[number];

export type YearFilter = "all" | YearLevel;

export const STUDENT_STATUS_LABELS = {
  enrolled: "Enrolled",
} as const;

export function isYearLevel(value: string): value is YearLevel {
  return YEAR_LEVELS.some((level) => level === value);
}

export function isYearFilter(value: string): value is YearFilter {
  return value === "all" || isYearLevel(value);
}