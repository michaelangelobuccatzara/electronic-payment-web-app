import { useId, useState } from "react";
import { PROMISSORY_STATUS_META } from "../../data/promissoryOptions";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { PromissoryNote } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";

interface ReviewDrawerProps {
  /** `null` means closed. The parent should set `key` to the note's id so the notes field resets. */
  note: PromissoryNote | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export function ReviewDrawer({ note, onClose, onApprove, onReject }: ReviewDrawerProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const notesId = `${baseId}-notes`;
  const [notes, setNotes] = useState("");

  useEscapeKey(note !== null, onClose);

  if (note === null) return null;

  const isPending = note.status === "pending";
  const meta = PROMISSORY_STATUS_META[note.status];

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-surface-dim/50 backdrop-blur-xs"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-xl h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <StatusBadge
                tone={meta.tone}
                label={isPending ? "Pending Review" : meta.label}
                showDot={false}
              />
            </div>
            <h2 id={titleId} className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
              {isPending ? "Review Promissory Request" : "Promissory Request"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors"
          >
            <Icon name="close" className="text-body-lg" />
          </button>
        </div>

        <div className="p-space-lg flex flex-col gap-space-lg flex-1">
          <div className="p-space-md bg-surface-container-low rounded-xl flex items-center gap-space-md">
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center justify-between gap-space-sm">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  {note.studentName}
                </span>
                <span className="font-data-tabular font-label-md text-label-md text-outline">
                  ID: {note.studentNumber}
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                {note.program} • {note.yearLevel}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-md bg-surface-container rounded-lg p-space-md">
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">
                Total Amount Due
              </span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface font-data-tabular mt-0.5">
                {formatCurrency(note.amountDue)}
              </span>
            </div>
          </div>

          {note.deferralReason && (
            <div className="flex flex-col bg-surface-container-low p-space-md rounded-lg">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-outline mb-1">
                Reason for Payment Deferral
              </span>
              <div className="flex items-start gap-space-xs text-on-surface">
                <Icon name="format_quote" className="text-body-md text-secondary mt-0.5" />
                <p className="font-body-md text-body-md italic leading-relaxed text-on-surface">
                  “{note.deferralReason}”
                </p>
              </div>
            </div>
          )}

          {isPending ? (
            <div className="flex flex-col gap-space-xs">
              <label htmlFor={notesId} className="font-label-md text-label-md font-semibold text-on-surface">
                Rejection or Conditional Notes
              </label>
              <textarea
                id={notesId}
                rows={3}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="State specific bursar notes or official rejection justification sent directly to student portal..."
                className="w-full p-space-sm bg-surface-container-low focus:bg-surface-container-lowest text-on-surface placeholder:text-outline font-body-sm text-body-sm rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-primary-container"
              />
            </div>
          ) : (
            note.status === "rejected" && (
              <div className="flex flex-col bg-error-container/40 p-space-md rounded-lg">
                <span className="font-label-sm text-label-sm uppercase font-semibold text-outline mb-1">
                  Rejection Reason
                </span>
                <p className="font-body-md text-body-md text-on-surface">
                  {note.rejectionReason ?? "No reason was recorded."}
                </p>
              </div>
            )
          )}
        </div>

        <div className="p-space-lg bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-space-lg py-2.5 rounded-xs text-label-md font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-center"
          >
            {isPending ? "Cancel" : "Close"}
          </button>
          {isPending && (
            <div className="flex items-center gap-space-sm w-full sm:w-auto">
              <button
                type="button"
                onClick={() => onReject(notes.trim())}
                className="flex-1 sm:flex-none px-space-lg py-2.5 rounded-xs text-label-md font-semibold bg-error text-on-error hover:bg-on-error-container transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Icon name="cancel" className="text-body-md" />
                Reject Request
              </button>
              <button
                type="button"
                onClick={onApprove}
                className="flex-1 sm:flex-none px-space-xl py-2.5 rounded-xs text-label-md font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Icon name="task_alt" className="text-body-md" />
                Approve Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}