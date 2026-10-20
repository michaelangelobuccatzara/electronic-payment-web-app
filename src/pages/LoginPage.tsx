import { Navigate, useLocation } from "react-router-dom";
import { hasAnyRole } from "../auth/roles";
import { useAuth } from "../auth/useAuth";
import { LoginBrandPanel } from "../components/auth/LoginBrandPanel";
import { LoginForm } from "../components/auth/LoginForm";
import { ROUTE_ROLES, getHomePath, toAppPath } from "../data/navigation";

// `location.state` is untyped, so narrow it instead of asserting.
function getFromPathname(state: unknown): string | null {
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
  return null;
}

export function LoginPage() {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;

  // Derived during render: once `login` flips isAuthenticated, this redirects.
  if (isAuthenticated) {
    const home = getHomePath(user?.roles);

    if (home === null) {
      // Signed in, but with no role this portal knows. Redirecting would just bounce around.
      return (
        <main className="flex min-h-screen items-center justify-center bg-background p-space-md">
          <section
            role="alert"
            className="flex max-w-md flex-col gap-space-sm rounded-lg bg-surface-container-lowest p-space-lg shadow-xl"
          >
            <h1 className="font-title-sm text-title-sm font-bold text-on-surface">
              No access assigned
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Your account doesn't have a role that can use this portal. Contact an administrator.
            </p>
            <button
              type="button"
              onClick={() => void logout()}
              className="self-start rounded-lg bg-surface-container px-space-md py-space-sm font-body-sm text-body-sm font-medium text-on-surface hover:bg-surface-container-high"
            >
              Sign out
            </button>
          </section>
        </main>
      );
    }

    // Return to the page they were bounced from only if THIS user may open it
    // (a different user may have signed in on the same browser). Otherwise, their home page.
    const from = toAppPath(getFromPathname(location.state) ?? "");
    const target =
      from !== null && hasAnyRole(user?.roles, ROUTE_ROLES[from]) ? from : home;

    return <Navigate to={target} replace />;
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