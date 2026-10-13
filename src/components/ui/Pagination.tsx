import { Icon } from "./Icon";

type PageItem = number | "start-ellipsis" | "end-ellipsis";

/** 1 2 3 … 31 near the start, 1 … 29 30 31 near the end, 1 … 9 10 11 … 31 in the middle. */
function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 3) return [1, 2, 3, "end-ellipsis", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "start-ellipsis", totalPages - 2, totalPages - 1, totalPages];
  }
  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ];
}

const NAV_BUTTON =
  "px-2.5 py-1.5 rounded-xs bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md flex items-center gap-0.5 shadow-xs disabled:text-outline disabled:opacity-50 disabled:hover:bg-surface-container-lowest";
const PAGE_BUTTON =
  "w-8 h-8 rounded-xs font-label-md text-label-md flex items-center justify-center shadow-xs";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  totalItems: number;
  /** Plural noun for the summary, e.g. "staff members". */
  itemLabel: string;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  totalItems,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="px-space-md py-space-sm bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Showing <span className="font-semibold text-on-surface">{rangeStart}</span> to{" "}
        <span className="font-semibold text-on-surface">{rangeEnd}</span> of{" "}
        <span className="font-semibold text-on-surface">{totalItems}</span> {itemLabel}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          className={NAV_BUTTON}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name="chevron_left" className="text-body-sm" />
          <span>Previous</span>
        </button>

        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${PAGE_BUTTON} ${
                item === currentPage
                  ? "bg-primary text-on-primary font-semibold"
                  : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className="px-1 text-outline font-body-sm text-body-sm">
              ...
            </span>
          ),
        )}

        <button
          type="button"
          className={NAV_BUTTON}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span>Next</span>
          <Icon name="chevron_right" className="text-body-sm" />
        </button>
      </nav>
    </div>
  );
}