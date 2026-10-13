import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { StaffManagement } from "./pages/StaffManagement";
import { NAV_ITEMS, ROUTE_PATHS } from "./data/navigation";
import {
  SAMPLE_ACADEMIC_CYCLE_LABEL,
  SAMPLE_DATE_TIME_LABEL,
  SAMPLE_PAYMENTS,
  SAMPLE_PROMISSORY_REQUESTS,
  SAMPLE_SUMMARY,
  SAMPLE_USER,
} from "./data/dashboardSample";
import {
  SAMPLE_CAMPUS_BRANCH,
  SAMPLE_NEXT_STAFF_ID,
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
                dateTimeLabel={SAMPLE_DATE_TIME_LABEL}
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
                  nextStaffId={SAMPLE_NEXT_STAFF_ID}
                  campusBranch={SAMPLE_CAMPUS_BRANCH}
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
              element={<PlaceholderPage title="Promissory Notes" />}
            />
            <Route
              path={ROUTE_PATHS.payments}
              element={<PlaceholderPage title="Payments" />}
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
