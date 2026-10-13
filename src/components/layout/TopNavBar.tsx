import type { UserProfile } from "../../types/types";
import { Icon } from "../ui/Icon";
import { LiveClock } from "./LiveClock";
import { useState } from "react";
import { LogoutConfirmModal } from "./LogoutConfirmModal";

interface TopNavBarProps {
  sectionLabel: string;
  user: UserProfile;
  isSidebarOpen: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
}

export function TopNavBar({
  sectionLabel,
  user,
  isSidebarOpen,
  onMenuClick,
  onLogout,
}: TopNavBarProps) {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface-container-lowest border-b border-outline-variant z-40 flex items-center justify-between px-space-xl">
        <div className="flex items-center gap-space-sm">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={isSidebarOpen}
            aria-controls="admin-sidebar"
            className="lg:hidden flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <Icon name="menu" />
          </button>

          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-space-sm text-on-surface-variant"
          >
            <Icon
              name="account_balance"
              className="text-body-lg text-outline"
            />
            <span className="hidden sm:inline font-body-sm text-body-sm text-outline">
              Institutional Administration
            </span>
            <span className="hidden sm:inline text-outline" aria-hidden="true">
              /
            </span>
            <span
              aria-current="page"
              className="font-title-sm text-title-sm text-on-surface font-semibold"
            >
              {sectionLabel}
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-space-lg">
          <div className="hidden md:flex items-center gap-space-xs text-on-surface-variant border-r border-outline-variant pr-space-lg">
            <Icon name="schedule" className="text-body-md text-outline" />
            <LiveClock />
          </div>

          <div className="flex items-center gap-space-sm pl-space-xs border-l border-outline-variant">
            <div className="flex flex-col text-left">
              <span className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">
                {user.name}
              </span>
              <span className="font-label-sm text-label-sm text-outline leading-tight">
                {user.role}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsLogoutOpen(true)}
              aria-label="Log out"
              title="Log out"
              aria-haspopup="dialog"
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container transition-colors"
            >
              <Icon name="logout" className="text-body-lg" />
            </button>
          </div>
        </div>
      </header>

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        onCancel={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          onLogout();
        }}
      />
    </>
  );
}
