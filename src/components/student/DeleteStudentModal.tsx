import { useId } from "react";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import { SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

interface DeleteStudentModalProps {
  isOpen: boolean;
  /** Stays set while the modal fades out, so the message doesn't blank mid-animation. */
  studentNumber: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteStudentModal({
  isOpen,
  studentNumber,
  onCancel,
  onConfirm,
}: DeleteStudentModalProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onCancel}
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
          Are you sure you want to remove student record{" "}
          <strong className="text-on-surface font-bold font-data-tabular">{studentNumber}</strong>?
          This action cannot be undone.
        </p>
      </div>
      <div className="flex items-center justify-end gap-space-sm mt-space-sm">
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-space-md py-space-sm bg-error hover:bg-on-error-container text-on-error font-title-sm text-body-sm font-semibold rounded-lg shadow-xs transition-colors"
        >
          Yes, Delete Record
        </button>
      </div>
    </AnimatedModal>
  );
}