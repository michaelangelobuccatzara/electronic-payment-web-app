import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export type Role = "Admin" | "Treasurer" | "Cashier";

interface ProtectedRouteProps {
  /** Omit to allow any authenticated user. */
  roles?: readonly Role[];
  /** Wrap a single element, or omit to guard nested routes via <Outlet />. */
  children?: ReactNode;
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Authenticated, but not allowed here: show 403, do NOT redirect to /login.
  // if (roles && (!user || !roles.includes(user.role))) {
  //   return (
  //     <section role="alert" className="p-8">
  //       <h1 className="text-xl font-semibold">Access denied</h1>
  //       <p>You don't have permission to view this page.</p>
  //     </section>
  //   );
  // }

  return children ?? <Outlet />;
}