import type { StaffMember, StaffSummary } from "../types/types";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_STAFF_SUMMARY: StaffSummary = {
  totalPersonnel: 184,
  activeAccounts: 179,
};

export const SAMPLE_NEXT_STAFF_ID = "STF-1007";
export const SAMPLE_CAMPUS_BRANCH = "Main Campus (Marbel)";

export const SAMPLE_STAFF: readonly StaffMember[] = [
  { staffId: "STF-1001", fullName: "Dr. Roberto Gonzales", department: "Office of Registrar", email: "r.gonzales@ndtc.edu.ph", status: "active" },
  { staffId: "STF-1002", fullName: "Maria Santos", department: "Bursar & Treasury", email: "m.santos@ndtc.edu.ph", status: "active" },
  { staffId: "STF-1003", fullName: "Eleanor Ramos", department: "Teller Operations", email: "e.ramos@ndtc.edu.ph", status: "active" },
  { staffId: "STF-1004", fullName: "Jonathan Cruz", department: "Student Accounts", email: "j.cruz@ndtc.edu.ph", status: "active" },
  { staffId: "STF-1005", fullName: "Patricia Lim", department: "Enrolment Services", email: "p.lim@ndtc.edu.ph", status: "active" },
  { staffId: "STF-1006", fullName: "Gabriel Reyes", department: "Systems & Security", email: "g.reyes@ndtc.edu.ph", status: "active" },
];