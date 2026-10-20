import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { NavItem } from "../../data/navigation";
import type { UserProfile } from "../../types/types";
import { Sidebar } from "./Sidebar";
import { TopNavBar } from "./TopNavBar";
import { useAuth } from "../../auth/useAuth";

interface AdminLayoutProps {
  navItems: readonly NavItem[];
  user: UserProfile;
}

export function AdminLayout({ navItems }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // calls the API (errors swallowed inside), then clears local state
    navigate("/login", { replace: true }); // also drops the `from` state, so the next user doesn't land on the previous user's page
  };

  // Derived during render, so no state or effect is needed.
  const sectionLabel =
    navItems.find((item) => item.path === pathname)?.sectionLabel ?? "";

  useEffect(() => {
    if (!isSidebarOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSidebarOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSidebarOpen]);

  return (
    <>
      <Sidebar
        items={navItems}
        isOpen={isSidebarOpen}
        onItemClick={() => setIsSidebarOpen(false)}
      />
      <div className="lg:pl-64">
        <TopNavBar
          sectionLabel={sectionLabel}
          isSidebarOpen={isSidebarOpen}
          onMenuClick={() => setIsSidebarOpen(true)}
          onLogout={handleLogout}
        />

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-inverse-surface/45 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <main className="w-full pt-16 bg-background min-h-screen px-space-xl pb-space-xl">
          <Outlet />
        </main>
      </div>
    </>
  );
}
