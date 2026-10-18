import { useCallback, useId, useState, type FormEvent } from "react";
import { getPromissoryStatusMeta } from "../../data/promissoryOptions";
import { useApiQuery } from "../../hooks/useApiQuery";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { ApprovePromissory, RejectPromissory } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";
import { promissoryService } from "./promissoryService";

const INPUT_CLASS =
  "w-full p-space-sm bg-surface-container-low focus:bg-surface-container-lowest text-on-surface text-body-md rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-primary-container";

const SECONDARY_BUTTON =
  "w-full sm:w-auto px-space-lg py-2.5 rounded-xs text-label-md font-semibold bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors text-center disabled:cursor-not-allowed disabled:opacity-60";

interface DetailItemProps {
  label: string;
  value: string;
  emphasized?: boolean;
}

function DetailItem({ label, value, emphasized = false }: DetailItemProps) {
  return (
    <div className="flex flex-col">
      <dt className="font-label-sm text-label-sm text-outline uppercase font-semibold">
        {label}
      </dt>
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

/** "review" = approve form (default). "reject" = reason step. */
type DecisionMode = "review" | "reject";

interface ReviewPanelProps {
  promissoryId: string;
  onClose: () => void;
  onApprove: (id: string, request: ApprovePromissory) => Promise<void>;
  onReject: (id: string, request: RejectPromissory) => Promise<void>;
}

function ReviewPanel({
  promissoryId,
  onClose,
  onApprove,
  onReject,
}: ReviewPanelProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    amount: `${baseId}-amount`,
    reason: `${baseId}-reason`,
    approveForm: `${baseId}-approve-form`,
    rejectForm: `${baseId}-reject-form`,
  };
  useEscapeKey(true, onClose);

  const fetchNote = useCallback(
    (signal: AbortSignal) => promissoryService.getById(promissoryId, signal),
    [promissoryId],
  );
  const {
    data: note,
    error: loadError,
    isLoading,
    reload,
  } = useApiQuery(fetchNote);

  const [mode, setMode] = useState<DecisionMode>("review");

  // `null` means "not edited yet": the field shows the note's current balance.
  const [typedAmount, setTypedAmount] = useState<string | null>(null);
  const amountValue = typedAmount ?? (note ? String(note.currentBalance) : "");

  const [reason, setReason] = useState("");

  const {
    run: approve,
    reset: resetApprove,
    isPending: isApproving,
    error: approveError,
  } = useAsyncAction(onApprove);
  const {
    run: reject,
    reset: resetReject,
    isPending: isRejecting,
    error: rejectError,
  } = useAsyncAction(onReject);

  const isPending = isApproving || isRejecting;
  const meta = note ? getPromissoryStatusMeta(note.status) : null;
  const canDecide = note?.status === "Pending";
  const isRejectStep = canDecide && mode === "reject";
  const trimmedReason = reason.trim();

  const startReject = () => {
    resetApprove();
    setMode("reject");
  };

  const backToReview = () => {
    resetReject();
    setMode("review");
  };

  const handleApprove = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const amount = Number(amountValue);
    if (!Number.isFinite(amount) || amount <= 0) return; // the input's min normally prevents this

    // On success the page closes the drawer. On failure the error shows here and the value is kept.
    await approve(promissoryId, { amount });
  };

  const handleReject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending || trimmedReason === "") return;

    await reject(promissoryId, { reasonOfRejection: trimmedReason });
  };

  const title = isRejectStep
    ? "Reject Promissory Request"
    : canDecide
      ? "Review Promissory Request"
      : "Promissory Request";

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
        aria-labelledby={ids.title}
        className="w-full max-w-xl h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto"
      >
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex flex-col">
            {meta && (
              <div className="flex items-center gap-space-xs">
                <StatusBadge
                  tone={meta.tone}
                  label={meta.label}
                  showDot={false}
                />
              </div>
            )}
            <h2
              id={ids.title}
              className="font-headline-md text-headline-md font-bold text-on-surface mt-1"
            >
              {title}
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

        <div
          aria-busy={isLoading}
          className="p-space-lg flex flex-col gap-space-lg flex-1"
        >
          {loadError !== null && (
            <ErrorAlert message={loadError} onRetry={reload} />
          )}

          {note === undefined ? (
            isLoading && (
              <p
                role="status"
                className="font-body-md text-body-md text-on-surface-variant"
              >
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
                <DetailItem
                  label="Current Balance"
                  value={formatCurrency(note.currentBalance)}
                  emphasized
                />
                {note.status !== "Rejected" && (
                  <DetailItem
                    label="Approved Amount"
                    value={
                      note.approvedAmount === null
                        ? "—"
                        : formatCurrency(note.approvedAmount)
                    }
                    emphasized
                  />
                )}
              </dl>

              {note.note && (
                <div className="flex flex-col bg-surface-container-low p-space-md rounded-lg">
                  <span className="font-label-sm text-label-sm uppercase font-semibold text-outline mb-1">
                    Student's Note
                  </span>
                  <div className="flex items-start gap-space-xs text-on-surface">
                    <Icon
                      name="format_quote"
                      className="text-body-md text-secondary mt-0.5"
                    />
                    <p className="font-body-md text-body-md italic leading-relaxed text-on-surface">
                      “{note.note}”
                    </p>
                  </div>
                </div>
              )}

              {note.status === "Rejected" && note.rejectionNote && (
                <div
                  role="note"
                  className="flex flex-col bg-error-container text-on-error-container p-space-md rounded-lg"
                >
                  <span className="font-label-sm text-label-sm uppercase font-semibold mb-1">
                    Reason for Rejection
                  </span>
                  <div className="flex items-start gap-space-xs">
                    <Icon name="block" className="text-body-md mt-0.5" />
                    <p className="font-body-md text-body-md leading-relaxed">
                      {note.rejectionNote}
                    </p>
                  </div>
                </div>
              )}

              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                <DetailItem
                  label="Submitted"
                  value={formatDateTime(note.createdAt)}
                />
                {note.lastModifiedAt && (
                  <DetailItem
                    label="Last Updated"
                    value={formatDateTime(note.lastModifiedAt)}
                  />
                )}
                {note.cateredStaffFullName && (
                  <DetailItem
                    label="Handled By"
                    value={note.cateredStaffFullName}
                  />
                )}
              </dl>

              {canDecide && !isRejectStep && (
                <form
                  id={ids.approveForm}
                  onSubmit={handleApprove}
                  className="flex flex-col gap-space-xs"
                >
                  <label
                    htmlFor={ids.amount}
                    className="font-label-md text-label-md font-semibold text-on-surface"
                  >
                    Amount to Approve (PHP)
                  </label>
                  <fieldset disabled={isPending} className="min-w-0">
                    <input
                      id={ids.amount}
                      type="number"
                      inputMode="decimal"
                      required
                      min="0.01"
                      step="0.01"
                      value={amountValue}
                      onChange={(event) => setTypedAmount(event.target.value)}
                      className={`${INPUT_CLASS} font-data-tabular`}
                    />
                  </fieldset>
                  <span className="font-body-sm text-body-sm text-outline">
                    Defaults to the student's current balance.
                  </span>
                </form>
              )}

              {isRejectStep && (
                <form
                  id={ids.rejectForm}
                  onSubmit={handleReject}
                  className="flex flex-col gap-space-xs"
                >
                  <label
                    htmlFor={ids.reason}
                    className="font-label-md text-label-md font-semibold text-on-surface"
                  >
                    Reason for Rejection
                  </label>
                  <fieldset disabled={isPending} className="min-w-0">
                    <textarea
                      id={ids.reason}
                      required
                      rows={4}
                      autoFocus
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder="Explain why this request is being rejected…"
                      className={`${INPUT_CLASS} resize-none`}
                    />
                  </fieldset>
                  <span className="font-body-sm text-body-sm text-outline">
                    The student will see this reason.
                  </span>
                </form>
              )}

              {!isRejectStep && approveError !== null && (
                <ErrorAlert message={approveError} />
              )}
              {isRejectStep && rejectError !== null && (
                <ErrorAlert message={rejectError} />
              )}
            </>
          )}
        </div>

        <div className="p-space-lg bg-surface-container-low flex flex-col-reverse sm:flex-row items-center justify-between gap-space-sm">
          {isRejectStep ? (
            <button
              type="button"
              onClick={backToReview}
              disabled={isPending}
              className={SECONDARY_BUTTON}
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className={SECONDARY_BUTTON}
            >
              {canDecide ? "Cancel" : "Close"}
            </button>
          )}

          {canDecide && !isRejectStep && (
            <div className="w-full sm:w-auto flex flex-col-reverse sm:flex-row gap-space-sm">
              <button
                type="button"
                onClick={startReject}
                disabled={isPending}
                className="w-full sm:w-auto px-space-lg py-2.5 rounded-xs text-label-md font-semibold bg-error-container text-on-error-container hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="block" className="text-body-md" />
                Reject
              </button>
              <button
                type="submit"
                form={ids.approveForm}
                disabled={isPending}
                className="w-full sm:w-auto px-space-xl py-2.5 rounded-xs text-label-md font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="task_alt" className="text-body-md" />
                {isApproving ? "Approving…" : "Approve Request"}
              </button>
            </div>
          )}

          {isRejectStep && (
            <button
              type="submit"
              form={ids.rejectForm}
              disabled={isPending || trimmedReason === ""}
              className="w-full sm:w-auto px-space-xl py-2.5 rounded-xs text-label-md font-semibold bg-error text-on-error hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon name="block" className="text-body-md" />
              {isRejecting ? "Rejecting…" : "Confirm Rejection"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReviewDrawerProps {
  /** `null` means closed. */
  promissoryId: string | null;
  onClose: () => void;
  /** Both reject on failure; the drawer shows the error and stays open. */
  onApprove: (id: string, request: ApprovePromissory) => Promise<void>;
  onReject: (id: string, request: RejectPromissory) => Promise<void>;
}

export function ReviewDrawer({
  promissoryId,
  onClose,
  onApprove,
  onReject,
}: ReviewDrawerProps) {
  if (promissoryId === null) return null;

  // `key` gives each request its own panel, so its state, mode and fetch start fresh every time.
  return (
    <ReviewPanel
      key={promissoryId}
      promissoryId={promissoryId}
      onClose={onClose}
      onApprove={onApprove}
      onReject={onReject}
    />
  );
}
