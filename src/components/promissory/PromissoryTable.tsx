import { getPromissoryStatusMeta } from "../../data/promissoryOptions";
import type { PromissoryRecord } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
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
  notes: readonly PromissoryRecord[];
  emptyMessage: string;
  /** Opens the review drawer for a note. */
  onOpen: (note: PromissoryRecord) => void;
}

export function PromissoryTable({ notes, emptyMessage, onOpen }: PromissoryTableProps) {
  return (
    <table className="w-full text-left font-body-sm text-body-sm">
      <caption className="sr-only">Promissory note requests</caption>
      <thead className="bg-surface-container font-label-sm text-label-sm uppercase tracking-wider text-outline select-none">
        <tr>
          <th scope="col" className="py-3 px-space-lg">Student Name</th>
          <th scope="col" className="py-3 px-space-md">Submission Date</th>
          <th scope="col" className="py-3 px-space-md text-right">Current Balance</th>
          <th scope="col" className="py-3 px-space-md">Status</th>
          <th scope="col" className="py-3 px-space-lg text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="text-on-surface">
        {notes.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-3 px-space-lg text-center text-on-surface-variant">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          notes.map((note) => {
            const meta = getPromissoryStatusMeta(note.status);
            const isPending = note.status === "Pending";
            const isRejected = note.status === "Rejected";
            const open = () => onOpen(note);
            return (
              <tr key={note.id} className="hover:bg-surface-container-low/60 transition-colors">
                <td className="py-3 px-space-lg font-semibold text-on-surface">
                  {note.studentFullName}
                </td>
                <td className="py-3 px-space-md font-data-tabular text-on-surface-variant">
                  {formatDateTime(note.createdAt)}
                </td>
                <td className="py-3 px-space-md font-data-tabular font-bold text-on-surface text-right">
                  {formatCurrency(note.currentBalance)}
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
                    ) : isRejected ? (
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