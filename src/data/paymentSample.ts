import type { PaymentsSummary, PaymentTransaction } from "../types/types";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_PAYMENTS_SUMMARY: PaymentsSummary = {
  totalCollected: 4825600,
  totalTransactions: 1248,
};

export const SAMPLE_PAYMENT_TRANSACTIONS: readonly PaymentTransaction[] = [
  { referenceNo: "PAY-2025-0891", studentName: "Althea Marie Mendoza", studentNumber: "2021-00142", amount: 12500, date: "Mar 03, 2025", time: "10:14 AM", method: "cash", status: "successful" },
  { referenceNo: "PAY-2025-0890", studentName: "Mark Kenneth Dela Cruz", studentNumber: "2021-00892", amount: 8750, date: "Mar 03, 2025", time: "09:45 AM", method: "cash", status: "successful" },
  { referenceNo: "PAY-2025-0889", studentName: "Christian Joshua Tan", studentNumber: "2022-00418", amount: 5000, date: "Mar 02, 2025", time: "04:22 PM", method: "credit", status: "successful" },
  { referenceNo: "PAY-2025-0888", studentName: "Sophia Nicole Bautista", studentNumber: "2024-00211", amount: 15000, date: "Mar 02, 2025", time: "02:10 PM", method: "cash", status: "successful" },
  { referenceNo: "PAY-2025-0887", studentName: "Gabriel Santos", studentNumber: "2023-01120", amount: 3200, date: "Mar 01, 2025", time: "11:30 AM", method: "cash-credit", status: "successful" },
  { referenceNo: "PAY-2025-0886", studentName: "Rafael Luis Ramos", studentNumber: "2022-01440", amount: 7400, date: "Mar 01, 2025", time: "08:50 AM", method: "cash", status: "successful" },
];