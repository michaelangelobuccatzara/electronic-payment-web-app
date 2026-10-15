import type { YearLevel } from "../data/studentOptions";
import type { PaymentMethod, PaymentTransactionStatus } from "../data/paymentOptions";

export interface UserProfile {
  firstName: string;
  name: string;
  role: string;
}

export type PaymentStatus = "successful" | "pending";

export interface Payment {
  referenceNo: string;
  studentName: string;
  yearLevel: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

import type { PromissoryStatus } from "../data/promissoryOptions";
export type { PromissoryStatus };

// Append:
export interface PromissoryNote {
  requestId: string;
  studentName: string;
  studentNumber: string;
  /** e.g. "BS Accountancy" */
  program: string;
  /** e.g. "2nd Yr" */
  yearLevel: string;
  /** Display string, e.g. "Mar 02, 2025". */
  submissionDate: string;
  amountDue: number;
  status: PromissoryStatus;
  deferralReason?: string;
  rejectionReason?: string;
}

export interface PromissoryNotesSummary {
  pendingCount: number;
  totalRequests: number;
}

export interface PromissoryRequest {
  requestId: string;
  studentName: string;
  yearLevel: string;
  amountDue: number;
  status: PromissoryStatus;
}

export interface DashboardSummary {
  totalStudents: number;
  totalStaff: number;
  pendingPromissoryRequests: number;
  paymentsCollected: number;
}

export type StaffStatus = "active";

export interface StaffMember {
  staffId: string;
  fullName: string;
  department: string;
  email: string;
  status: StaffStatus;
}

export interface StaffSummary {
  totalPersonnel: number;
  activeAccounts: number;
}

export type StaffRole =
  | "Cashier"
  | "Treasurer";

export type StaffPermissionId =
  | "view-balances"
  | "issue-receipts"
  | "approve-promissory";

export interface NewStaffDraft {
  fullName: string;
  email: string;
  role: StaffRole;
  temporaryPassword: string;
}

export type StudentStatus = "enrolled"; // Only status in the design. Add members when others are designed.

export interface AssessmentLine {
  label: string;
  /** Negative for discounts. */
  amount: number;
}

export interface StudentTransaction {
  description: string;
  reference: string;
  date: string;
  amount: number;
}

/** Billing and family details. Optional because the source only shows them for one sample student. */
export interface StudentAccountDetails {
  emergencyContact: string;
  scholarship: string;
  enrolledUnits: number;
  assessment: readonly AssessmentLine[];
  transactions: readonly StudentTransaction[];
}

export interface Student {
  studentId: string;
  fullName: string;
  email: string;
  yearLevel: YearLevel;
  status: StudentStatus;
  balance: number;
  lastModified?: string;
  details?: StudentAccountDetails;
}

export type NewStudentDraft = Pick<
  Student, "fullName" | "email" | "yearLevel" | "studentId"
>;

export type StudentEdits = Pick<
  Student,
  "fullName" | "yearLevel" | "email"
>;

export type GradingPeriodStatus = "past" | "current" | "upcoming";

export interface GradingPeriod {
  id: string;
  academicYear: string;
  /** e.g. "2nd Semester" */
  semester: string;
  /** e.g. "Midterms" */
  milestone: string;
  /** Display string, e.g. "Feb 10, 2025". */
  dueDate: string;
  status: GradingPeriodStatus;
}

export interface GradingPeriodsSummary {
  configuredTerms: number;
  coverageLabel: string;
}

export interface NewGradingPeriodDraft {
  title: string;
  chargeDueDate: string;
}

export interface PaymentTransaction {
  referenceNo: string;
  studentName: string;
  studentNumber: string;
  amount: number;
  /** Display string, e.g. "Mar 03, 2025". */
  date: string;
  /** Display string, e.g. "10:14 AM". */
  time: string;
  method: PaymentMethod;
  status: PaymentTransactionStatus;
}

export interface PaymentsSummary {
  totalCollected: number;
  totalTransactions: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}