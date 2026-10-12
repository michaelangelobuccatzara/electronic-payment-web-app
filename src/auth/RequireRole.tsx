import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./useAuth";

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
}

export default function RequireRole({ roles, children }: RequireRoleProps) {
  const { user } = useAuth();

  if (!roles.some((role) => user?.roles.includes(role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}