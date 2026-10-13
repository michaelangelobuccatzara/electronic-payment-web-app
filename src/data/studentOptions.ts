export const PROGRAMS = [
  "BS Information Technology",
  "BS Accountancy",
  "BS Nursing",
  "BSED",
  "BS Business Administration",
  "BS Hospitality Management",
  "BS Criminology",
] as const;
export type Program = (typeof PROGRAMS)[number];

export const YEAR_LEVELS = ["1st Year", "2nd Year", "3rd Year", "4th Year"] as const;
export type YearLevel = (typeof YEAR_LEVELS)[number];

export type YearFilter = "all" | YearLevel;

export const STUDENT_STATUS_LABELS = {
  enrolled: "Enrolled",
} as const;

// Narrow raw <select> values, which the DOM types as plain string.
export function isProgram(value: string): value is Program {
  return PROGRAMS.some((program) => program === value);
}

export function isYearLevel(value: string): value is YearLevel {
  return YEAR_LEVELS.some((level) => level === value);
}

export function isYearFilter(value: string): value is YearFilter {
  return value === "all" || isYearLevel(value);
}