import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { StaffManagement } from "./pages/StaffManagement";
import { SAMPLE_USER } from "./data/dashboardSample";
import { StudentManagement } from "./pages/StudentManagement";
import { GradingPeriods } from "./pages/GradingPeriods";
import { PromissoryNotes } from "./pages/PromissoryNotes";
import { Payments } from "./pages/Payments";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./pages/LoginPage";
import { NAV_ITEMS, ROUTE_PATHS, ROUTE_ROLES } from "./data/navigation";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route
              element={<AdminLayout navItems={NAV_ITEMS} user={SAMPLE_USER} />}
            >
              <Route
                path={ROUTE_PATHS.dashboard}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.dashboard]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.staff}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.staff]}>
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.students}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.students]}>
                    <StudentManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.gradingPeriods}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.gradingPeriods]}>
                    <GradingPeriods />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.promissoryNotes}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.promissoryNotes]}>
                    <PromissoryNotes />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTE_PATHS.payments}
                element={
                  <ProtectedRoute roles={ROUTE_ROLES[ROUTE_PATHS.payments]}>
                    <Payments />
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
