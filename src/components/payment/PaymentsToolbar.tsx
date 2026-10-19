import { Icon } from "../ui/Icon";

interface PaymentsToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PaymentsToolbar({ searchQuery, onSearchChange }: PaymentsToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-xs mb-space-md">
      <div className="relative w-full sm:max-w-md">
        <Icon
          name="search"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-lg pointer-events-none"
        />
        <input
          type="text"
          aria-label="Search payments"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search payments..."
          className="w-full pl-10 pr-4 py-2 bg-background text-on-surface placeholder:text-outline text-body-md font-body-md rounded-lg focus:outline-hidden focus:bg-surface-container-lowest transition-all"
        />
      </div>
    </div>
  );
}