import type { CurrentSemester } from "../../types/types";
import { formatAcademicYear } from "../../utils/gradingPeriod";
import { Icon } from "../ui/Icon";

interface CurrentPeriodBannerProps {
  semester: CurrentSemester;
}

export function CurrentPeriodBanner({ semester }: CurrentPeriodBannerProps) {
  return (
    <section
      aria-label="Current semester"
      className="relative overflow-hidden rounded-xl bg-surface-container-lowest shadow-xs p-space-lg flex flex-col md:flex-row md:items-center justify-between gap-space-md"
    >
      <div aria-hidden="true" className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container" />
      <div className="flex items-start md:items-center gap-space-md pl-space-xs">
        <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">
          <Icon name="verified" className="text-headline-md" />
        </div>
        <div className="flex flex-col">
          <h2 className="font-title-sm text-title-sm md:text-headline-md text-on-surface font-bold tracking-tight mt-1">
            {formatAcademicYear(semester.schoolYearFrom, semester.schoolYearTo)} • {semester.name}
          </h2>
        </div>
      </div>
    </section>
  );
}