import { PROMISSORY_STATUS_META } from "../../data/promissoryOptions";
import type { PromissoryNote } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { StatusBadge } from "../ui/StatusBadge";

const VIEW_BUTTON =
  "py-1 rounded-xs text-label-sm font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors";
const APPROVE_BUTTON =
  "px-2.5 py-1 rounded-xs text-label-sm font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs";
const REJECT_BUTTON =
  "px-2.5 py-1 rounded-xs text-label-sm font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors";
const REASON_BUTTON =
  "px-3 py-1 rounded-xs text-label-sm font-semibold bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors";

interface PromissoryTableProps {
  notes: readonly PromissoryNote[];
  /** Opens the review drawer for a note. */
  onOpen: (note: PromissoryNote) => void;
}

export function PromissoryTable({ notes, onOpen }: PromissoryTableProps) {
  return (
    <table className="w-full text-left font-body-sm text-body-sm">
      <caption className="sr-only">Promissory note requests</caption>
      <thead className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-outline select-none">
        <tr>
          <th scope="col" className="py-3 px-space-lg">Request ID</th>
          <th scope="col" className="py-3 px-space-md">Student Name</th>
          <th scope="col" className="py-3 px-space-md">Student No.</th>
          <th scope="col" className="py-3 px-space-md">Submission Date</th>
          <th scope="col" className="py-3 px-space-md text-right">Amount Due</th>
          <th scope="col" className="py-3 px-space-md">Status</th>
          <th scope="col" className="py-3 px-space-lg text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="text-on-surface">
        {notes.length === 0 ? (
          <tr>
            <td colSpan={7} className="py-3 px-space-lg text-center text-on-surface-variant">
              No promissory notes match your filters.
            </td>
          </tr>
        ) : (
          notes.map((note) => {
            const meta = PROMISSORY_STATUS_META[note.status];
            const isPending = note.status === "pending";
            const open = () => onOpen(note);
            return (
              <tr
                key={note.requestId}
                className="hover:bg-surface-container-low/60 transition-colors"
              >
                <td
                  className={`py-3 px-space-lg font-data-tabular font-bold ${
                    isPending ? "text-primary" : "text-outline"
                  }`}
                >
                  {note.requestId}
                </td>
                <td className="py-3 px-space-md">
                  <div className="flex flex-col">
                    <span className="font-semibold text-on-surface">{note.studentName}</span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {note.program} • {note.yearLevel}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-space-md font-data-tabular text-on-surface-variant">
                  {note.studentNumber}
                </td>
                <td className="py-3 px-space-md font-data-tabular text-on-surface-variant">
                  {note.submissionDate}
                </td>
                <td className="py-3 px-space-md font-data-tabular font-bold text-on-surface text-right">
                  {formatCurrency(note.amountDue)}
                </td>
                <td className="py-3 px-space-md">
                  <StatusBadge tone={meta.tone} label={meta.label} size="md" />
                </td>
                <td className="py-3 px-space-lg text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {isPending ? (
                      <>
                        <button type="button" onClick={open} className={`px-2.5 ${VIEW_BUTTON}`}>
                          View Details
                        </button>
                        <button type="button" onClick={open} className={APPROVE_BUTTON}>
                          Approve
                        </button>
                        <button type="button" onClick={open} className={REJECT_BUTTON}>
                          Reject
                        </button>
                      </>
                    ) : note.status === "rejected" ? (
                      <button type="button" onClick={open} className={REASON_BUTTON}>
                        View Reason
                      </button>
                    ) : (
                      <button type="button" onClick={open} className={`px-3 ${VIEW_BUTTON}`}>
                        View Details
                      </button>
                    )}
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