import { useId } from "react";
import {
  ACADEMIC_YEARS,
  isAcademicYearFilter,
  type AcademicYearFilter,
} from "../../data/gradingPeriodOptions";

interface PeriodToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  yearFilter: AcademicYearFilter;
  onYearFilterChange: (value: AcademicYearFilter) => void;
}

export function PeriodToolbar({
  searchQuery,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
}: PeriodToolbarProps) {
  const filterId = useId();

  return (
    <div className="p-space-md bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div className="flex items-center gap-space-sm flex-1 max-w-md">
        <div className="relative w-full">
          <input
            type="text"
            aria-label="Search grading periods"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search academic term, semester, code..."
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-lg focus:outline-hidden focus:bg-surface-container-lowest transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-xs self-end md:self-auto">
        <label htmlFor={filterId} className="font-label-sm text-label-sm text-outline uppercase pr-1">
          Filter:
        </label>
        <select
          id={filterId}
          value={yearFilter}
          onChange={(event) => {
            const value = event.target.value;
            if (isAcademicYearFilter(value)) onYearFilterChange(value);
          }}
          className="bg-surface-container-low text-on-surface text-body-sm font-body-sm rounded-lg px-2.5 py-1.5 focus:outline-hidden"
        >
          <option value="all">All Academic Years</option>
          {ACADEMIC_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}