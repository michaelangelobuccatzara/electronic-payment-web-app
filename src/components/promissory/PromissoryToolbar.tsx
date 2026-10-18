import { Icon } from "../ui/Icon";

interface PromissoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PromissoryToolbar({ searchQuery, onSearchChange }: PromissoryToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
      <div className="relative w-full sm:max-w-md">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none"
        />
        <input
          type="text"
          aria-label="Search promissory notes"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search promissory notes..."
          className="w-full pl-10 pr-4 py-2 bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-primary-container"
        />
      </div>
    </div>
  );
}