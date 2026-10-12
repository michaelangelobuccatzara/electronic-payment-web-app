import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { NAV_ITEMS, ROUTE_PATHS } from "./data/navigation";
import {
  SAMPLE_ACADEMIC_CYCLE_LABEL,
  SAMPLE_DATE_TIME_LABEL,
  SAMPLE_PAYMENTS,
  SAMPLE_PROMISSORY_REQUESTS,
  SAMPLE_SUMMARY,
  SAMPLE_USER,
} from "./data/dashboardSample";

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
            <Route path={ROUTE_PATHS.staff} element={<PlaceholderPage title="Staff" />} />
            <Route path={ROUTE_PATHS.students} element={<PlaceholderPage title="Students" />} />
            <Route path={ROUTE_PATHS.gradingPeriods} element={<PlaceholderPage title="Grading Periods" />} />
            <Route path={ROUTE_PATHS.promissoryNotes} element={<PlaceholderPage title="Promissory Notes" />} />
            <Route path={ROUTE_PATHS.payments} element={<PlaceholderPage title="Payments" />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;