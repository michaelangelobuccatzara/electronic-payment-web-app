import { isYearFilter, YEAR_LEVELS, type YearFilter } from "../../data/studentOptions";
import { Icon } from "../ui/Icon";

interface StudentToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  yearFilter: YearFilter;
  onYearFilterChange: (value: YearFilter) => void;
}

export function StudentToolbar({
  searchQuery,
  onSearchChange,
  yearFilter,
  onYearFilterChange,
}: StudentToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col lg:flex-row gap-space-md items-center justify-between">
      <div className="flex-1 w-full flex items-center bg-surface-container-low rounded-lg px-space-md py-space-xs focus-within:bg-surface-container-lowest transition-all shadow-inner">
        <Icon name="search" className="text-headline-md text-outline" />
        <input
          type="text"
          aria-label="Search students"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by student number or name..."
          className="w-full bg-transparent px-space-sm py-1 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-hidden"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm w-full lg:w-auto">
        <div className="relative flex-1 sm:w-44">
          <select
            aria-label="Filter by year level"
            value={yearFilter}
            onChange={(event) => {
              const value = event.target.value;
              if (isYearFilter(value)) onYearFilterChange(value);
            }}
            className="w-full appearance-none bg-surface-container-low px-space-md py-2.5 pr-8 rounded-lg font-body-sm text-body-sm text-on-surface font-medium focus:outline-hidden cursor-pointer"
          >
            <option value="all">All Years</option>
            {YEAR_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <Icon
            name="expand_more"
            className="pointer-events-none absolute right-2.5 top-2.5 text-body-lg text-outline"
          />
        </div>
      </div>
    </div>
  );
}