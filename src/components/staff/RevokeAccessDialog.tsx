import { useId } from "react";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { StaffMember } from "../../types/types";
import { getInitials } from "../../utils/getInitials";
import { Icon } from "../ui/Icon";
import { formatFullName } from "../../utils/formatFullName";
import { useAsyncAction } from "../../hooks/useAsyncAction";

interface RevokeAccessDialogProps {
  /** The person being revoked. `null` means the dialog is closed. */
  member: StaffMember | null;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export function RevokeAccessDialog({
  member,
  onCancel,
  onConfirm,
}: RevokeAccessDialogProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const descriptionId = `${baseId}-description`;

  const {
    run: confirm,
    isPending,
    error,
    reset: resetError,
  } = useAsyncAction(onConfirm);
  const handleCancel = () => {
    resetError();
    onCancel();
  };
  useEscapeKey(member !== null, handleCancel);

  if (member === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-xs">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-space-lg flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
            <Icon name="warning" />
          </div>
          <div className="flex flex-col">
            <h3
              id={titleId}
              className="font-title-sm text-title-sm font-bold text-on-surface"
            >
              Revoke Staff System Clearance?
            </h3>
            <p
              id={descriptionId}
              className="font-body-sm text-body-sm text-on-surface-variant mt-1"
            >
              Are you sure you want to disable account access for this
              personnel? This action will immediately terminate active cashier
              POS sessions and revoke ledger signing authority.
            </p>
          </div>
        </div>

        <div className="mx-space-lg mb-space-md p-space-sm bg-surface-container-low rounded-lg flex items-center gap-space-sm">
          <div className="w-8 h-8 rounded-xs bg-error-container text-on-error-container font-label-md text-label-md flex items-center justify-center font-bold">
            {getInitials(
              `${member.firstName} ${member.middleName} ${member.lastName}`,
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-body-sm text-body-sm font-bold text-on-surface leading-tight">
              {formatFullName({
                firstName: member.firstName,
                middleName: member.middleName,
                lastName: member.lastName,
              })}{" "}
              ({member.schoolId})
            </span>
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-space-sm">
          <button
            type="button"
            autoFocus
            onClick={handleCancel}
            className="h-9 px-4 rounded-lg bg-surface-container-lowest text-on-surface border border-outline-variant hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            className="h-9 px-4 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md font-semibold shadow-xs transition-colors flex items-center gap-1"
          >
            <Icon name="person_remove" className="text-body-md" />
            <span>Revoke Access</span>
          </button>
        </div>
      </div>
    </div>
  );
}
