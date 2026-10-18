import type { GradingPeriodRecord } from "../../types/types";
import { formatDateOnly } from "../../utils/formatDateOnly";

const EDIT_BUTTON =
  "px-2 py-1 rounded-xs bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-sm text-label-sm font-medium";
const DELETE_BUTTON =
  "px-2 py-1 rounded-xs bg-error-container text-on-error-container hover:opacity-90 transition-opacity font-label-sm text-label-sm font-medium";

interface PeriodTableProps {
  periods: readonly GradingPeriodRecord[];
  /** e.g. "AY 2026–2027". All periods shown belong to the same semester. */
  academicYear: string;
  emptyMessage: string;
  onEdit: (period: GradingPeriodRecord) => void;
}

export function PeriodTable({ periods, academicYear, emptyMessage, onEdit }: PeriodTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">Grading periods</caption>
      <thead>
        <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm tracking-wider uppercase">
          <th scope="col" className="py-2.5 px-space-lg font-semibold">Period Name</th>
          <th scope="col" className="py-2.5 px-space-md font-semibold">Academic Year</th>
          <th scope="col" className="py-2.5 px-space-md font-semibold">Charge Due Date</th>
          <th scope="col" className="py-2.5 px-space-lg font-semibold text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="text-body-sm font-body-sm divide-y-0">
        {periods.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-3 px-space-lg text-center text-on-surface-variant">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          periods.map((period) => (
            <tr key={period.id} className="hover:bg-surface-container-low transition-colors">
              <td className="py-3 px-space-lg font-body-md text-body-md font-semibold text-on-surface">
                {period.name}
              </td>
              <td className="py-3 px-space-md font-data-tabular text-data-tabular text-on-surface">
                {academicYear}
              </td>
              <td className="py-3 px-space-md font-data-tabular text-data-tabular text-on-surface">
                {formatDateOnly(period.chargeDueDate)}
              </td>
              <td className="py-3 px-space-lg text-right">
                <div className="inline-flex items-center gap-space-xs">
                  <button
                    type="button"
                    aria-label={`Edit ${period.name}`}
                    onClick={() => onEdit(period)}
                    className={EDIT_BUTTON}
                  >
                    Edit
                  </button>
                  <button type="button" aria-label={`Delete ${period.name}`} className={DELETE_BUTTON}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}