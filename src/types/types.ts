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