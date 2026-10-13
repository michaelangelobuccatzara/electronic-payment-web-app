import { useId } from "react";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ isOpen, onCancel, onConfirm }: LogoutConfirmModalProps) {
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
      <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
        <Icon name="logout" className="text-headline-lg" />
      </div>
      <div className="flex flex-col gap-space-xs">
        <h3 id={titleId} className="font-headline-md text-headline-md font-bold text-on-surface">
          Confirm Log Out
        </h3>
        <p id={descriptionId} className="font-body-md text-body-md text-on-surface-variant">
          Are you sure you want to log out? You will need to sign in again to continue.
        </p>
      </div>
      <div className="flex items-center justify-end gap-space-sm mt-space-sm">
        <button
          type="button"
          autoFocus
          onClick={onCancel}
          className="px-space-md py-space-sm bg-surface-container text-on-surface font-title-sm text-body-sm font-medium rounded-lg hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-space-md py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors"
        >
          Yes, Log Out
        </button>
      </div>
    </AnimatedModal>
  );
}