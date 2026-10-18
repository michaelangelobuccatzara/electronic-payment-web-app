import { useCallback, useId } from "react";
import { getPromissoryStatusMeta } from "../../data/promissoryOptions";
import { useApiQuery } from "../../hooks/useApiQuery";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";
import { promissoryService } from "./promissoryService";

interface DetailItemProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

function DetailItem({ label, value, emphasized = false }: DetailItemProps) {
  return (
    <div className="flex flex-col">
      <dt className="font-label-sm text-label-sm text-outline uppercase font-semibold">{label}</dt>
      <dd
        className={
          emphasized
            ? "font-headline-md text-headline-md font-bold text-on-surface font-data-tabular mt-0.5"
            : "font-body-md text-body-md text-on-surface mt-0.5"
        }
      >
        {value}
      </dd>
    </div>
  );
}

interface ReviewPanelProps {
  promissoryId: string;
  onClose: () => void;
}

function ReviewPanel({ promissoryId, onClose }: ReviewPanelProps) {
  const titleId = useId();
  useEscapeKey(true, onClose);

  const fetchNote = useCallback(
    (signal: AbortSignal) => promissoryService.getById(promissoryId, signal),
    [promissoryId],
  );
  const { data: note, error, isLoading, reload } = useApiQuery(fetchNote);

  const meta = note ? getPromissoryStatusMeta(note.status) : null;

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
            {meta && (
              <div className="flex items-center gap-space-xs">
                <StatusBadge tone={meta.tone} label={meta.label} showDot={false} />
              </div>
            )}
            <h2 id={titleId} className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
              Promissory Request
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

        <div aria-busy={isLoading} className="p-space-lg flex flex-col gap-space-lg flex-1">
          {error !== null && <ErrorAlert message={error} onRetry={reload} />}

          {note === undefined ? (
            isLoading && (
              <p role="status" className="font-body-md text-body-md text-on-surface-variant">
                Loading details…
              </p>
            )
          ) : (
            <>
              <div className="p-space-md bg-surface-container-low rounded-xl">
                <span className="font-title-sm text-title-sm font-bold text-on-surface">
                  {note.studentFullName}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-space-md bg-surface-container rounded-lg p-space-md">
                <DetailItem label="Current Balance" value={formatCurrency(note.currentBalance)} emphasized />
                <DetailItem
                  label="Approved Amount"
                  value={note.approvedAmount === null ? "—" : formatCurrency(note.approvedAmount)}
                  emphasized
                />
              </dl>

              {note.note && (
                <div className="flex flex-col bg-surface-container-low p-space-md rounded-lg">
                  <span className="font-label-sm text-label-sm uppercase font-semibold text-outline mb-1">
                    Student's Note
                  </span>
                  <div className="flex items-start gap-space-xs text-on-surface">
                    <Icon name="format_quote" className="text-body-md text-secondary mt-0.5" />
                    <p className="font-body-md text-body-md italic leading-relaxed text-on-surface">
                      “{note.note}”
                    </p>
                  </div>
                </div>
              )}

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <DetailItem label="Submitted" value={formatDateTime(note.createdAt)} />
                {note.lastModifiedAt && (
                  <DetailItem label="Last Updated" value={formatDateTime(note.lastModifiedAt)} />
                )}
                {note.cateredStaffFullName && (
                  <DetailItem label="Handled By" value={note.cateredStaffFullName} />
                )}
              </dl>
            </>
          )}
        </div>

        <div className="p-space-lg bg-surface-container-low flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-space-lg py-2.5 rounded-xs text-label-md font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface ReviewDrawerProps {
  /** `null` means closed. */
  promissoryId: string | null;
  onClose: () => void;
}

export function ReviewDrawer({ promissoryId, onClose }: ReviewDrawerProps) {
  if (promissoryId === null) return null;

  // `key` gives each request its own panel, so its state and fetch start fresh every time.
  return <ReviewPanel key={promissoryId} promissoryId={promissoryId} onClose={onClose} />;
}