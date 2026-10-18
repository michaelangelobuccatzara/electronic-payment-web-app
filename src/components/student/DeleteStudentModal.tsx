import { useId } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { StudentRecord } from "../../types/types";
import { formatFullName } from "../../utils/formatFullName";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

interface DeleteStudentModalProps {
  isOpen: boolean;
  /** Stays set while the modal fades out, so the message doesn't blank mid-animation. */
  student: StudentRecord | null;
  onCancel: () => void;
  /** Rejects on failure; the modal shows the error and stays open. */
  onConfirm: () => Promise<void>;
}

export function DeleteStudentModal({ isOpen, student, onCancel, onConfirm }: DeleteStudentModalProps) {
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
    >
      <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
        <Icon name="warning" className="text-headline-lg" />
      </div>
      <div className="flex flex-col gap-space-xs">
        <h3 id={titleId} className="font-headline-md text-headline-md font-bold text-on-surface">
          Confirm Student Removal
        </h3>
        <p id={descriptionId} className="font-body-md text-body-md text-on-surface-variant">
          Are you sure you want to remove{" "}
          {student && (
            <>
              <strong className="text-on-surface font-bold">{formatFullName(student)}</strong> (
              <span className="font-data-tabular">{student.schoolId}</span>)
            </>
          )}
          ? This action cannot be undone.
        </p>
      </div>

      {error !== null && <ErrorAlert message={error} />}

      <div className="flex items-center justify-end gap-space-sm mt-space-sm">
        <button type="button" onClick={handleCancel} disabled={isPending} className={SECONDARY_BUTTON_CLASS}>
          Cancel
        </button>
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={isPending}
          className="px-space-md py-space-sm bg-error hover:bg-on-error-container text-on-error font-title-sm text-body-sm font-semibold rounded-lg shadow-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Deleting…" : "Yes, Delete Record"}
        </button>
      </div>
    </AnimatedModal>
  );
}