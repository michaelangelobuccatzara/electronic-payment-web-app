import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import type { NavItem } from "../../data/navigation";
import type { UserProfile } from "../../types/types";
import { Sidebar } from "./Sidebar";
import { TopNavBar } from "./TopNavBar";

interface AdminLayoutProps {
  navItems: readonly NavItem[];
  user: UserProfile;
  academicCycleLabel: string;
}

export function AdminLayout({
  navItems,
  academicCycleLabel,
}: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the session (token, user data) here once authentication exists.
    navigate("/login", { replace: true });
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
        academicCycleLabel={academicCycleLabel}
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
