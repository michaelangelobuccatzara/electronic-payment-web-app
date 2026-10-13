import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StaffManagement } from "./pages/StaffManagement";
import { NAV_ITEMS, ROUTE_PATHS } from "./data/navigation";
import {
  SAMPLE_ACADEMIC_CYCLE_LABEL,
  SAMPLE_PAYMENTS,
  SAMPLE_PROMISSORY_REQUESTS,
  SAMPLE_SUMMARY,
  SAMPLE_USER,
} from "./data/dashboardSample";
import {
  SAMPLE_STAFF,
  SAMPLE_STAFF_SUMMARY,
} from "./data/staffSample";
import { StudentManagement } from "./pages/StudentManagement";
import { SAMPLE_STUDENTS } from "./data/studentSample";
import { GradingPeriods } from "./pages/GradingPeriods";
import {
  SAMPLE_GRADING_PERIODS,
  SAMPLE_GRADING_SUMMARY,
} from "./data/gradingPeriodSample";
import { PromissoryNotes } from "./pages/PromissoryNotes";
import {
  SAMPLE_PROMISSORY_NOTES,
  SAMPLE_PROMISSORY_SUMMARY,
} from "./data/promissorySample";
import { Payments } from "./pages/Payments";
import {
  SAMPLE_PAYMENT_TRANSACTIONS,
  SAMPLE_PAYMENTS_SUMMARY,
} from "./data/paymentSample";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            element={
              <AdminLayout
                navItems={NAV_ITEMS}
                user={SAMPLE_USER}
                academicCycleLabel={SAMPLE_ACADEMIC_CYCLE_LABEL}
              />
            }
          >
            <Route
              path={ROUTE_PATHS.dashboard}
              element={
                <AdminDashboard
                  firstName={SAMPLE_USER.firstName}
                  summary={SAMPLE_SUMMARY}
                  recentPayments={SAMPLE_PAYMENTS}
                  recentPromissoryRequests={SAMPLE_PROMISSORY_REQUESTS}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.staff}
              element={
                <StaffManagement
                  staff={SAMPLE_STAFF}
                  summary={SAMPLE_STAFF_SUMMARY}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.students}
              element={
                <StudentManagement
                  initialStudents={SAMPLE_STUDENTS}
                  totalStudents={SAMPLE_SUMMARY.totalStudents}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.gradingPeriods}
              element={
                <GradingPeriods
                  periods={SAMPLE_GRADING_PERIODS}
                  summary={SAMPLE_GRADING_SUMMARY}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.promissoryNotes}
              element={
                <PromissoryNotes
                  initialNotes={SAMPLE_PROMISSORY_NOTES}
                  summary={SAMPLE_PROMISSORY_SUMMARY}
                />
              }
            />
            <Route
              path={ROUTE_PATHS.payments}
              element={
                <Payments
                  transactions={SAMPLE_PAYMENT_TRANSACTIONS}
                  summary={SAMPLE_PAYMENTS_SUMMARY}
                />
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
