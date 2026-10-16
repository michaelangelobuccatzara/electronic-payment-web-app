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
import { SAMPLE_STAFF, SAMPLE_STAFF_SUMMARY } from "./data/staffSample";
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
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
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
                  <ProtectedRoute roles={["Admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.staff}
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <StaffManagement
                      staff={SAMPLE_STAFF}
                      summary={SAMPLE_STAFF_SUMMARY}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.students}
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <StudentManagement
                      initialStudents={SAMPLE_STUDENTS}
                      totalStudents={SAMPLE_SUMMARY.totalStudents}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.gradingPeriods}
                element={
                  <ProtectedRoute roles={["Admin"]}>
                    <GradingPeriods
                      periods={SAMPLE_GRADING_PERIODS}
                      summary={SAMPLE_GRADING_SUMMARY}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.promissoryNotes}
                element={
                  <ProtectedRoute roles={["Admin", "Treasurer"]}>
                    <PromissoryNotes
                      initialNotes={SAMPLE_PROMISSORY_NOTES}
                      summary={SAMPLE_PROMISSORY_SUMMARY}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.payments}
                element={
                  <ProtectedRoute roles={["Admin", "Cashier"]}>
                    <Payments
                      transactions={SAMPLE_PAYMENT_TRANSACTIONS}
                      summary={SAMPLE_PAYMENTS_SUMMARY}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
