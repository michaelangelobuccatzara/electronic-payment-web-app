import { Icon } from "../ui/Icon";

interface StaffToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function StaffToolbar({
  searchQuery,
  onSearchChange,
  onAddClick,
}: StaffToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col lg:flex-row items-center justify-between gap-space-md">
      <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full lg:w-auto flex-1">
        <div className="relative w-full sm:max-w-md">
          <Icon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none"
          />
          <input
            type="text"
            aria-label="Search staff"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by first name or last name"
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg focus:outline-hidden focus:bg-surface-container-lowest placeholder:text-outline shadow-inner"
          />
        </div>
      </div>

      <div className="flex items-center gap-space-sm w-full lg:w-auto justify-end">
        <button
          type="button"
          onClick={onAddClick}
          aria-haspopup="dialog"
          className="h-10 px-4 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <Icon name="person_add" className="text-body-lg" />
          <span>+ Add Staff</span>
        </button>
      </div>
    </div>
  );
}