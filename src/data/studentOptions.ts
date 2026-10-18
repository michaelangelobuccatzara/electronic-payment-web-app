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

export const STUDENT_TYPES = ["Kindergarten", "Elementary", "JuniorHigh", "SeniorHigh"] as const;
export type StudentType = (typeof STUDENT_TYPES)[number];

export const STUDENT_TYPE_LABELS: Record<StudentType, string> = {
  Kindergarten: "Kindergarten",
  Elementary: "Elementary",
  JuniorHigh: "Junior High School",
  SeniorHigh: "Senior High School",
};

export function isStudentType(value: string): value is StudentType {
  return STUDENT_TYPES.some((type) => type === value);
}