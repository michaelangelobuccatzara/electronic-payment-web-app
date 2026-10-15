import { Navigate, useLocation } from "react-router-dom";
import { LoginBrandPanel } from "../components/auth/LoginBrandPanel";
import { LoginForm } from "../components/auth/LoginForm";
import { ROUTE_PATHS } from "../data/navigation";
import { useAuth } from "../auth/useAuth";

// `location.state` is untyped, so narrow it instead of asserting.
function getRedirectPath(state: unknown): string {
  if (typeof state === "object" && state !== null && "from" in state) {
    const { from } = state;
    if (
      typeof from === "object" &&
      from !== null &&
      "pathname" in from &&
      typeof from.pathname === "string"
    ) {
      return from.pathname;
    }
  }
  return ROUTE_PATHS.dashboard;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth(); // `login` is an assumption, see below
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  // Derived during render: once `login` flips isAuthenticated, this redirects.
  if (isAuthenticated) {
    return <Navigate to={getRedirectPath(location.state)} replace />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-space-md">
      <div className="grid min-h-[580px] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-lg bg-surface-container-lowest shadow-xl md:grid-cols-12">
        <LoginBrandPanel />
        <LoginForm onSubmit={login} />
      </div>
    </main>
  );
}