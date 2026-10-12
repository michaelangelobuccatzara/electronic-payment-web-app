import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { AppPath } from "../../data/navigation";
import { Icon } from "../ui/Icon";

interface DashboardPanelProps {
  title: string;
  iconName: string;
  iconClassName: string;
  viewAllTo: AppPath;
  children: ReactNode;
}

export function DashboardPanel({
  title,
  iconName,
  iconClassName,
  viewAllTo,
  children,
}: DashboardPanelProps) {
  return (
    <section className="bg-surface-container-lowest rounded-xl shadow-xs flex flex-col overflow-hidden">
      <div className="px-space-lg py-space-md flex items-center justify-between bg-surface-container-low">
        <div className="flex items-center gap-space-sm">
          <Icon name={iconName} className={`text-body-lg ${iconClassName}`} />
          <h2 className="font-title-sm text-title-sm text-on-surface font-semibold">
            {title}
          </h2>
        </div>
        <Link
          to={viewAllTo}
          className="font-label-sm text-label-sm text-primary hover:underline font-semibold flex items-center gap-0.5"
        >
          View All <Icon name="chevron_right" className="text-body-sm" />
        </Link>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}