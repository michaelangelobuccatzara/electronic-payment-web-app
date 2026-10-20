export const ROUTE_PATHS = {
  dashboard: "/dashboard",
  staff: "/staff",
  students: "/students",
  gradingPeriods: "/grading-periods",
  promissoryNotes: "/promissory-notes",
  payments: "/payments",
  promissorySubmission: "/promissory-submission",
} as const;
import { ROLES, type Role } from "../auth/roles";

export type AppPath = (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS];

export interface NavItem {
  path: AppPath;
  label: string;
  icon: string;
  sectionLabel: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  {
    path: ROUTE_PATHS.dashboard,
    label: "Dashboard",
    icon: "dashboard",
    sectionLabel: "Overview & Accounting",
  },
  {
    path: ROUTE_PATHS.staff,
    label: "Staff",
    icon: "badge",
    sectionLabel: "Staff",
  },
  {
    path: ROUTE_PATHS.students,
    label: "Students",
    icon: "school",
    sectionLabel: "Students",
  },
  {
    path: ROUTE_PATHS.gradingPeriods,
    label: "Grading Periods",
    icon: "calendar_month",
    sectionLabel: "Grading Periods",
  },
  {
    path: ROUTE_PATHS.promissoryNotes,
    label: "Promissory Notes",
    icon: "description",
    sectionLabel: "Promissory Notes",
  },
  {
    path: ROUTE_PATHS.payments,
    label: "Payments",
    icon: "payments",
    sectionLabel: "Payments",
  },
  {
    path: ROUTE_PATHS.promissorySubmission,
    label: "Submit Promissory",
    icon: "request_quote",
    sectionLabel: "Promissory Submission",
  },
];

export const ROUTE_ROLES: Record<AppPath, readonly Role[]> = {
  [ROUTE_PATHS.dashboard]: ["Admin"],
  [ROUTE_PATHS.staff]: ["Admin"],
  [ROUTE_PATHS.students]: ["Admin"],
  [ROUTE_PATHS.gradingPeriods]: ["Admin"],
  [ROUTE_PATHS.promissoryNotes]: ["Admin", "Treasurer"],
  [ROUTE_PATHS.payments]: ["Admin", "Cashier"],
  [ROUTE_PATHS.promissorySubmission]: ["Student"],
};

const ROLE_HOME_PATH: Record<Role, AppPath> = {
  Admin: ROUTE_PATHS.dashboard,
  Treasurer: ROUTE_PATHS.promissoryNotes,
  Cashier: ROUTE_PATHS.payments,
  Student: ROUTE_PATHS.promissorySubmission,
};

export function getHomePath(
  userRoles: readonly string[] | undefined,
): AppPath | null {
  const role = ROLES.find((candidate) => userRoles?.includes(candidate));
  return role ? ROLE_HOME_PATH[role] : null;
}

export function toAppPath(pathname: string): AppPath | null {
  return NAV_ITEMS.find((item) => item.path === pathname)?.path ?? null;
}
