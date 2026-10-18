interface PeriodToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PeriodToolbar({ searchQuery, onSearchChange }: PeriodToolbarProps) {
  return (
    <div className="p-space-md bg-surface-container-lowest flex items-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          aria-label="Search grading periods"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search grading periods..."
          className="w-full px-3 py-1.5 bg-surface-container-low text-on-surface placeholder:text-outline text-body-sm font-body-sm rounded-lg focus:outline-hidden focus:bg-surface-container-lowest transition-all"
        />
      </div>
    </div>
  );
}