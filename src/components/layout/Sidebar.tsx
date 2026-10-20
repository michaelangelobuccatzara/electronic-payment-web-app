import { NavLink } from "react-router-dom";
import type { NavItem } from "../../data/navigation";
import { Icon } from "../ui/Icon";
import { AcademicCycleCard } from "./AcademicCycleCard";

// External asset from the Stitch export. Consider replacing with a local file.
const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1We0JsHN99A_BKjIcLkDLZRyPVuC46f3G7QqeZ6VDKYWnIiNBvcXaH39lfrKsDT3BWQW5VWiMjs_z5GNJmtvXckr7LlWI67whmac_wOavwKYbsTiGjVGP5UNPjhHz6mk_eMyPnYea8MWq8eaoMoaB3L01Q-4pmCXn8VQ1AbE4gKTtM2QLzjZu4gwzFgBGggH1T8Err4hglphJH7PGgcGuowbogYekRHAv8csnaD8oJloKS97Fyo2fETgNY";

const LINK_BASE_CLASSES =
  "flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors";
const LINK_ACTIVE_CLASSES =
  "bg-secondary-container text-on-secondary-container font-semibold";
const LINK_INACTIVE_CLASSES =
  "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface";

interface SidebarProps {
  items: readonly NavItem[];
  /** Only affects viewports below `lg`; on desktop the sidebar is always visible. */
  isOpen: boolean;
  /** Called when a nav link is clicked, so the mobile drawer can close. */
  onItemClick: () => void;
}

export function Sidebar({ items, isOpen, onItemClick }: SidebarProps) {
  return (
    <aside
      id="admin-sidebar"
      className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest z-50 flex flex-col justify-between border-r border-outline-variant transition-transform lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col">
        <div className="h-16 px-space-lg flex items-center gap-space-sm border-b border-outline-variant bg-surface-container-lowest">
          <img
            alt="School Administration Logo"
            className="h-8 w-auto object-contain"
            src={LOGO_URL}
          />
          <div className="flex flex-col min-w-0">
            <span className="font-title-sm text-title-sm text-on-surface font-semibold tracking-tight truncate leading-tight">
              Electronic-Payment-App
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant truncate uppercase">
              School Administration Portal
            </span>
          </div>
        </div>

        <div className="px-space-md py-space-sm">
          <span className="px-space-sm font-label-sm text-label-sm text-outline uppercase tracking-wider">
            Administrative Menu
          </span>
        </div>

        <nav
          aria-label="Primary"
          className="flex flex-col gap-space-xs px-space-sm"
        >
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `${LINK_BASE_CLASSES} ${
                  isActive ? LINK_ACTIVE_CLASSES : LINK_INACTIVE_CLASSES
                }`
              }
            >
              <Icon name={item.icon} className="text-body-lg" />
              <span className="font-body-md text-body-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-space-md border-t border-outline-variant bg-surface-container-low">
        <AcademicCycleCard />
      </div>
    </aside>
  );
}
