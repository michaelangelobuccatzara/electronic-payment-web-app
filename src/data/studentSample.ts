import type { Student } from "../types/types";

const LAST_MODIFIED = "Oct 23, 2024 by Registrar Office";

// Sample data copied from the Stitch design. Replace with real data when available.
export const SAMPLE_STUDENTS: readonly Student[] = [
  {
    studentNumber: "2021-00142",
    fullName: "Althea Marie Mendoza",
    email: "a.mendoza@student.univ.edu",
    phone: "+63 917 482 1092",
    program: "BS Information Technology",
    yearLevel: "4th Year",
    status: "enrolled",
    balance: 0,
    lastModified: LAST_MODIFIED,
    details: {
      emergencyContact: "Elena Mendoza (Mother)",
      scholarship: "Academic Honors (50%)",
      enrolledUnits: 21,
      assessment: [
        { label: "Tuition Fee (21 Units × ₱950.00)", amount: 19950 },
        { label: "Laboratory Fees (3 Subjects)", amount: 4500 },
        { label: "Athletic & Campus Facilities", amount: 1250 },
        { label: "Academic Honors Discount (-50% Tuition)", amount: -9975 },
      ],
      transactions: [
        {
          description: "Online Card Settlement",
          reference: "TXN-90218",
          date: "Oct 12, 2024",
          amount: 15725,
        },
      ],
    },
  },
  { studentNumber: "2022-00418", fullName: "Christian Joshua Tan", email: "cj.tan@student.univ.edu", phone: "+63 928 331 4981", program: "BS Accountancy", yearLevel: "3rd Year", status: "enrolled", balance: 8450, lastModified: LAST_MODIFIED },
  { studentNumber: "2023-01055", fullName: "Bea Angela Soriano", email: "b.soriano@student.univ.edu", phone: "+63 945 119 8830", program: "BS Nursing", yearLevel: "2nd Year", status: "enrolled", balance: 14200, lastModified: LAST_MODIFIED },
  { studentNumber: "2021-00892", fullName: "Mark Kenneth Dela Cruz", email: "mk.delacruz@student.univ.edu", phone: "+63 905 672 9011", program: "BS Business Administration", yearLevel: "4th Year", status: "enrolled", balance: 0, lastModified: LAST_MODIFIED },
  { studentNumber: "2024-00211", fullName: "Sophia Nicole Bautista", email: "s.bautista@student.univ.edu", phone: "+63 939 772 1943", program: "BS Hospitality Management", yearLevel: "1st Year", status: "enrolled", balance: 6800, lastModified: LAST_MODIFIED },
  { studentNumber: "2022-01440", fullName: "Rafael Luis Ramos", email: "r.ramos@student.univ.edu", phone: "+63 918 840 5518", program: "BS Criminology", yearLevel: "3rd Year", status: "enrolled", balance: 0, lastModified: LAST_MODIFIED },
];