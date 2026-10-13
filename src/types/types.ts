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

export type PromissoryStatus = "pending" | "approved";

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
  | "Finance Officer"
  | "Registrar"
  | "Academic Head"
  | "Head Cashier"
  | "Billing Specialist"
  | "IT Administrator";

export type StaffPermissionId =
  | "view-balances"
  | "issue-receipts"
  | "approve-promissory";

export interface NewStaffDraft {
  fullName: string;
  email: string;
  role: StaffRole;
  temporaryPassword: string;
  permissions: readonly StaffPermissionId[];
}