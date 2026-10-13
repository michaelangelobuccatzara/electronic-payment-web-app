import type {
  DashboardSummary,
  Payment,
  PromissoryRequest,
  UserProfile,
} from "../types/types";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_USER: UserProfile = {
  firstName: "Maria",
  name: "Maria Santos",
  role: "Finance Officer",
};

export const SAMPLE_ACADEMIC_CYCLE_LABEL = "AY 2024–2025 • 2nd Semester";

export const SAMPLE_SUMMARY: DashboardSummary = {
  totalStudents: 3842,
  totalStaff: 184,
  pendingPromissoryRequests: 14,
  paymentsCollected: 4825600,
};

export const SAMPLE_PAYMENTS: readonly Payment[] = [
  { referenceNo: "PAY-2025-0891", studentName: "Althea Reyes", yearLevel: "BS Information Tech", amount: 12500, date: "Oct 24, 2024", status: "successful" },
  { referenceNo: "PAY-2025-0890", studentName: "Joshua De Leon", yearLevel: "BS Accountancy", amount: 8450, date: "Oct 24, 2024", status: "successful" },
  { referenceNo: "PAY-2025-0889", studentName: "Catherine Tan", yearLevel: "BS Nursing", amount: 15200, date: "Oct 23, 2024", status: "pending" },
  { referenceNo: "PAY-2025-0888", studentName: "Marc Gonzales", yearLevel: "BA Communication", amount: 6000, date: "Oct 23, 2024", status: "successful" },
  { referenceNo: "PAY-2025-0887", studentName: "Danielle Flores", yearLevel: "BS Civil Eng", amount: 18750, date: "Oct 23, 2024", status: "successful" },
];

export const SAMPLE_PROMISSORY_REQUESTS: readonly PromissoryRequest[] = [
  { requestId: "PR-2025-042", studentName: "Elijah Bautista", yearLevel: "3rd Yr - BS IT", amountDue: 14300, status: "pending" },
  { requestId: "PR-2025-041", studentName: "Bianca Mendoza", yearLevel: "2nd Yr - BS Accountancy", amountDue: 9800, status: "pending" },
  { requestId: "PR-2025-040", studentName: "Jerome Castillo", yearLevel: "4th Yr - BS Civil Eng", amountDue: 18200, status: "approved" },
  { requestId: "PR-2025-039", studentName: "Patricia Gomez", yearLevel: "1st Yr - BS Nursing", amountDue: 11400, status: "approved" },
  { requestId: "PR-2025-038", studentName: "Arvin Valencia", yearLevel: "3rd Yr - BA Comm", amountDue: 7500, status: "pending" },
];