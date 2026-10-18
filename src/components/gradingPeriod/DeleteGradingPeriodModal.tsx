import { useId } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { GradingPeriodRecord } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { CANCEL_BUTTON_CLASS, MODAL_BOX_CLASS, MODAL_OVERLAY_CLASS } from "./periodStyles";

interface DeleteGradingPeriodModalProps {
  isOpen: boolean;
  /** Stays set while the modal fades out, so the message doesn't blank mid-animation. */
  period: GradingPeriodRecord | null;
  onCancel: () => void;
  /** Rejects on failure; the modal shows the error and stays open. */
  onConfirm: () => Promise<void>;
}

export function DeleteGradingPeriodModal({
  isOpen,
  period,
  onCancel,
  onConfirm,
}: DeleteGradingPeriodModalProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  const { run: confirm, isPending, error, reset: resetError } = useAsyncAction(onConfirm);

  const handleCancel = () => {
    resetError();
    onCancel();
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={handleCancel}
      role="alertdialog"
      labelledBy={titleId}
      describedBy={descriptionId}
      maxWidthClassName="max-w-md"
      overlayClassName={MODAL_OVERLAY_CLASS}
      boxClassName={MODAL_BOX_CLASS}
    >
      <div className="p-space-lg flex items-start gap-space-md">
        <div className="w-10 h-10 rounded-full bg-error-container text-error flex items-center justify-center shrink-0">
          <Icon name="warning" className="text-body-lg" />
        </div>
        <div className="flex flex-col gap-space-xs">
          <h3 id={titleId} className="font-title-sm text-title-sm font-bold text-on-surface">
            Delete Grading Period?
          </h3>
          <p id={descriptionId} className="font-body-sm text-body-sm text-on-surface-variant">
            Are you sure you want to delete{" "}
            {period && <strong className="text-on-surface font-bold">{period.name}</strong>}? This
            action cannot be undone.
          </p>
        </div>
      </div>

      {error !== null && (
        <div className="px-space-lg pb-space-md">
          <ErrorAlert message={error} />
        </div>
      )}

      <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isPending}
          className={`${CANCEL_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={isPending}
          className="px-space-md py-2 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md font-semibold shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Deleting…" : "Delete Period"}
        </button>
      </div>
    </AnimatedModal>
  );
}