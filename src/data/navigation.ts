export const ROUTE_PATHS = {
  dashboard: "/dashboard",
  staff: "/staff",
  students: "/students",
  gradingPeriods: "/grading-periods",
  promissoryNotes: "/promissory-notes",
  payments: "/payments",
} as const;

export type AppPath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export interface NavItem {
  path: AppPath;
  label: string;
  /** Material Symbols icon name */
  icon: string;
  /** Last breadcrumb segment in the top bar. Only the dashboard's value comes from the Stitch source. */
  sectionLabel: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: ROUTE_PATHS.dashboard, label: "Dashboard", icon: "dashboard", sectionLabel: "Overview & Accounting" },
  { path: ROUTE_PATHS.staff, label: "Staff", icon: "badge", sectionLabel: "Staff" },
  { path: ROUTE_PATHS.students, label: "Students", icon: "school", sectionLabel: "Students" },
  { path: ROUTE_PATHS.gradingPeriods, label: "Grading Periods", icon: "calendar_month", sectionLabel: "Grading Periods" },
  { path: ROUTE_PATHS.promissoryNotes, label: "Promissory Notes", icon: "description", sectionLabel: "Promissory Notes" },
  { path: ROUTE_PATHS.payments, label: "Payments", icon: "payments", sectionLabel: "Payments" },
];