import type { GradingPeriod, GradingPeriodStatus } from "../../types/types";
import { getPeriodName } from "../../utils/gradingPeriod";

interface StatusStyles {
  row: string;
  name: string;
  year: string;
  dueDate: string;
  /** The dot is color-only in the design, so this gives screen readers the same information. */
  srLabel: string;
  secondaryAction: "delete";
}

const STATUS_STYLES: Record<GradingPeriodStatus, StatusStyles> = {
  current: {
    row: "bg-secondary-container/20",
    name: "font-title-sm text-title-sm font-bold",
    year: "font-semibold",
    dueDate: "text-on-surface",
    srLabel: "Current period: ",
    secondaryAction: "delete",
  },
  past: {
    row: "",
    name: "font-body-md text-body-md font-semibold",
    year: "",
    dueDate: "text-on-surface-variant",
    srLabel: "Past period: ",
    secondaryAction: "delete",
  },
  upcoming: {
    row: "",
    name: "font-body-md text-body-md font-semibold",
    year: "",
    dueDate: "text-on-surface",
    srLabel: "Upcoming period: ",
    secondaryAction: "delete",
  },
};

const EDIT_BUTTON =
  "px-2 py-1 rounded-xs bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm font-medium";
const DELETE_BUTTON =
  "px-2 py-1 rounded-xs bg-error-container text-on-error-container hover:opacity-90 transition-opacity font-label-sm text-label-sm font-medium";

interface PeriodTableProps {
  periods: readonly GradingPeriod[];
}

export function PeriodTable({ periods }: PeriodTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">Grading periods</caption>
      <thead>
        <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm tracking-wider uppercase">
          <th scope="col" className="py-2.5 px-space-lg font-semibold">
            Period Name
          </th>
          <th scope="col" className="py-2.5 px-space-md font-semibold">
            Academic Year
          </th>
          <th scope="col" className="py-2.5 px-space-md font-semibold">
            Charge Due Date
          </th>
          <th
            scope="col"
            className="py-2.5 px-space-lg font-semibold text-right"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="text-body-sm font-body-sm divide-y-0">
        {periods.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="py-3 px-space-lg text-center text-on-surface-variant"
            >
              No grading periods match your search.
            </td>
          </tr>
        ) : (
          periods.map((period) => {
            const styles = STATUS_STYLES[period.status];
            const name = getPeriodName(period);
            return (
              <tr
                key={period.id}
                className={`hover:bg-surface-container-low transition-colors ${styles.row}`}
              >
                <td className="py-3 px-space-lg">
                  <div className="flex items-center gap-space-sm">
                    <span
                      aria-hidden="true"
                      className={`w-2 h-2 rounded-full shrink-0 ${styles.dot}`}
                    />
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-on-surface leading-tight ${styles.name}`}
                      >
                        <span className="sr-only">{styles.srLabel}</span>
                        {name}
                      </span>
                    </div>
                  </div>
                </td>
                <td
                  className={`py-3 px-space-md font-data-tabular text-data-tabular text-on-surface ${styles.year}`}
                >
                  {period.academicYear}
                </td>
                <td
                  className={`py-3 px-space-md font-data-tabular text-data-tabular ${styles.dueDate}`}
                >
                  {period.dueDate}
                </td>
                <td className="py-3 px-space-lg text-right">
                  <div className="inline-flex items-center gap-space-xs">
                    {/* No behavior in the source for any of these. */}
                    <button
                      type="button"
                      aria-label={`Edit ${name}`}
                      className={EDIT_BUTTON}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${name}`}
                      className={DELETE_BUTTON}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
