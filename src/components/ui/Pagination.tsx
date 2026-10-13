import { Icon } from "./Icon";

type PageItem = number | "start-ellipsis" | "end-ellipsis";
type PaginationVariant = "labeled" | "compact";

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

interface VariantStyles {
  container: string;
  navButton: string;
  pageButton: string;
  activePage: string;
  inactivePage: string;
  ellipsis: string;
}

const VARIANT_STYLES: Record<PaginationVariant, VariantStyles> = {
  // Staff screen: text "Previous"/"Next" buttons, raised page buttons.
  labeled: {
    container: "px-space-md py-space-sm bg-surface-container-low",
    navButton:
      "px-2.5 py-1.5 rounded-xs bg-surface-container-lowest text-on-surface hover:bg-surface-container font-label-md text-label-md flex items-center gap-0.5 shadow-xs disabled:text-outline disabled:opacity-50 disabled:hover:bg-surface-container-lowest",
    pageButton:
      "w-8 h-8 rounded-xs font-label-md text-label-md flex items-center justify-center shadow-xs",
    activePage: "bg-primary text-on-primary font-semibold",
    inactivePage: "bg-surface-container-lowest text-on-surface hover:bg-surface-container",
    ellipsis: "px-1 text-outline font-body-sm text-body-sm",
  },
  // Students screen: icon-only prev/next, flat page buttons.
  compact: {
    container: "px-space-lg py-space-md bg-surface-container-lowest",
    navButton:
      "px-2.5 py-1.5 rounded-md bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors disabled:text-outline disabled:opacity-40 disabled:hover:bg-surface-container-low",
    pageButton: "px-3 py-1 rounded-md font-label-md text-label-md",
    activePage: "bg-primary text-on-primary font-semibold",
    inactivePage: "hover:bg-surface-container-low text-on-surface transition-colors",
    ellipsis: "px-2 text-outline font-label-md text-label-md",
  },
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  totalItems: number;
  /** Plural noun for the summary, e.g. "staff members". */
  itemLabel: string;
  onPageChange: (page: number) => void;
  variant?: PaginationVariant;
}

export function Pagination({
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  totalItems,
  itemLabel,
  onPageChange,
  variant = "labeled",
}: PaginationProps) {
  const styles = VARIANT_STYLES[variant];
  const isCompact = variant === "compact";
  const emphasis = isCompact
    ? "font-semibold text-on-surface font-data-tabular"
    : "font-semibold text-on-surface";
  const total = totalItems.toLocaleString("en-US");

  return (
    <div
      className={`${styles.container} flex flex-col sm:flex-row items-center justify-between gap-space-sm`}
    >
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Showing{" "}
        {isCompact ? (
          <strong className={emphasis}>
            {rangeStart} to {rangeEnd}
          </strong>
        ) : (
          <>
            <span className={emphasis}>{rangeStart}</span> to{" "}
            <span className={emphasis}>{rangeEnd}</span>
          </>
        )}{" "}
        of <span className={emphasis}>{total}</span> {itemLabel}
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Previous page"
          className={styles.navButton}
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name="chevron_left" className={isCompact ? "text-body-md align-middle" : "text-body-sm"} />
          {!isCompact && <span>Previous</span>}
        </button>

        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <button
              key={item}
              type="button"
              aria-label={`Page ${item}`}
              aria-current={item === currentPage ? "page" : undefined}
              onClick={() => onPageChange(item)}
              className={`${styles.pageButton} ${
                item === currentPage ? styles.activePage : styles.inactivePage
              }`}
            >
              {item}
            </button>
          ) : (
            <span key={item} className={styles.ellipsis}>
              ...
            </span>
          ),
        )}

        <button
          type="button"
          aria-label="Next page"
          className={styles.navButton}
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {!isCompact && <span>Next</span>}
          <Icon name="chevron_right" className={isCompact ? "text-body-md align-middle" : "text-body-sm"} />
        </button>
      </nav>
    </div>
  );
}