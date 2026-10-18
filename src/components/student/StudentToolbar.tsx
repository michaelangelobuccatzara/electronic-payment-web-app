import { Icon } from "../ui/Icon";

interface StudentToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function StudentToolbar({ searchQuery, onSearchChange }: StudentToolbarProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs">
      <div className="flex w-full items-center bg-surface-container-low rounded-lg px-space-md py-space-xs focus-within:bg-surface-container-lowest transition-all shadow-inner">
        <Icon name="search" className="text-headline-md text-outline" />
        <input
          type="text"
          aria-label="Search students"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by student id or name..."
          className="w-full bg-transparent px-space-sm py-1 font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-hidden"
        />
      </div>
    </div>
  );
}