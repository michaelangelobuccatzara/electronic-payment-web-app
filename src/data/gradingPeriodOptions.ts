export const ACADEMIC_YEARS = ["AY 2024–2025", "AY 2023–2024"] as const;
export type AcademicYear = (typeof ACADEMIC_YEARS)[number];

export type AcademicYearFilter = "all" | AcademicYear;
export const DEFAULT_ACADEMIC_YEAR_FILTER: AcademicYearFilter = "AY 2024–2025";

/** Narrows a raw <select> value, which the DOM types as plain string. */
export function isAcademicYearFilter(value: string): value is AcademicYearFilter {
  return value === "all" || ACADEMIC_YEARS.some((year) => year === value);
}