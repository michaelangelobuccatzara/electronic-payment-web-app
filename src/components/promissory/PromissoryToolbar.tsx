import { STATUS_FILTER_OPTIONS, type PromissoryStatusFilter } from "../../data/promissoryOptions";
import { Icon } from "../ui/Icon";

const PILL_BASE = "px-space-md py-1.5 rounded-full text-label-md font-label-md font-semibold";
const PILL_ACTIVE = "bg-primary text-on-primary shadow-xs";
const PILL_INACTIVE =
  "bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors";

interface PromissoryToolbarProps {
  statusFilter: PromissoryStatusFilter;
  onStatusFilterChange: (value: PromissoryStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PromissoryToolbar({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
}: PromissoryToolbarProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
      <div role="group" aria-label="Filter by status" className="flex items-center flex-wrap gap-space-xs">
        {STATUS_FILTER_OPTIONS.map((option) => {
          const isActive = option.value === statusFilter;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStatusFilterChange(option.value)}
              className={`${PILL_BASE} ${isActive ? PILL_ACTIVE : PILL_INACTIVE}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 sm:w-80 lg:flex-none">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none"
        />
        <input
          type="text"
          aria-label="Search promissory notes"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by Request ID, Student Name, or Student ID..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-primary-container"
        />
      </div>
    </div>
  );
}