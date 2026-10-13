import type { PromissoryNote, PromissoryNotesSummary } from "../types/types";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_PROMISSORY_SUMMARY: PromissoryNotesSummary = {
  pendingCount: 14,
  totalRequests: 42,
};

export const SAMPLE_PROMISSORY_NOTES: readonly PromissoryNote[] = [
  {
    requestId: "PN-2025-0142",
    studentName: "Bea Angela Soriano",
    studentNumber: "2023-01055",
    program: "BS Accountancy",
    yearLevel: "2nd Yr",
    submissionDate: "Mar 02, 2025",
    amountDue: 14200,
    status: "pending",
    deferralReason:
      "Delayed family remittance from OFW parent based in Dubai due to overseas company payroll cycle adjustment. Remittance scheduled for arrival on March 25th.",
  },
  { requestId: "PN-2025-0141", studentName: "Christian Joshua Tan", studentNumber: "2022-00418", program: "BS Computer Science", yearLevel: "3rd Yr", submissionDate: "Mar 01, 2025", amountDue: 8450, status: "pending" },
  { requestId: "PN-2025-0139", studentName: "Miguel Antonio Flores", studentNumber: "2024-00331", program: "BS Nursing", yearLevel: "1st Yr", submissionDate: "Feb 28, 2025", amountDue: 12000, status: "pending" },
  { requestId: "PN-2025-0138", studentName: "Katrina Mae Villanueva", studentNumber: "2021-00789", program: "BS Civil Engineering", yearLevel: "4th Yr", submissionDate: "Feb 27, 2025", amountDue: 6500, status: "approved" },
  { requestId: "PN-2025-0137", studentName: "Dave Russell Perez", studentNumber: "2022-00914", program: "BS Psychology", yearLevel: "3rd Yr", submissionDate: "Feb 26, 2025", amountDue: 15000, status: "rejected" },
  { requestId: "PN-2025-0135", studentName: "Sarah Jane Ocampo", studentNumber: "2023-00512", program: "BS Information Technology", yearLevel: "2nd Yr", submissionDate: "Feb 25, 2025", amountDue: 9800, status: "approved" },
];