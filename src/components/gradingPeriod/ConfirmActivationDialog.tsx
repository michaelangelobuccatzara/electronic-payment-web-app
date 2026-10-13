import { useId } from "react";
import type { GradingPeriod } from "../../types/types";
import { getPeriodName } from "../../utils/gradingPeriod";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import {
  CANCEL_BUTTON_CLASS,
  MODAL_BOX_CLASS,
  MODAL_OVERLAY_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "./periodStyles";

interface ConfirmActivationDialogProps {
  isOpen: boolean;
  /** The period being activated. Keep it set while the dialog fades out. */
  target: GradingPeriod | null;
  /** The period that is current right now, if any. */
  current: GradingPeriod | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmActivationDialog({
  isOpen,
  target,
  current,
  onCancel,
  onConfirm,
}: ConfirmActivationDialogProps) {
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
      maxWidthClassName="max-w-lg"
      overlayClassName={MODAL_OVERLAY_CLASS}
      boxClassName={MODAL_BOX_CLASS}
    >
      {target && (
        <>
          <div className="p-space-lg flex flex-col gap-space-md">
            <div className="flex items-start gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed-variant shrink-0">
                <Icon name="warning" className="text-headline-md" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm uppercase font-semibold tracking-wider text-outline">
                  Administrative Confirmation
                </span>
                <h3
                  id={titleId}
                  className="font-title-sm text-title-sm md:text-headline-md font-bold text-on-surface"
                >
                  Change Current Grading Period
                </h3>
                <p
                  id={descriptionId}
                  className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed"
                >
                  Are you sure you want to activate{" "}
                  <span className="font-bold text-on-surface">{getPeriodName(target)}</span>? This
                  will update due dates across all student accounts and promissory agreements
                  immediately.
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
              <div className="flex items-center gap-space-xs text-on-surface font-semibold text-body-sm">
                <Icon name="notification_important" className="text-body-md text-secondary" />
                <span>Immediate System Repercussions:</span>
              </div>
              <ul className="font-body-sm text-body-sm text-on-surface-variant space-y-1 pl-6 list-disc">
                {current && (
                  <li>Current period ({current.milestone}) will be marked as past clearance.</li>
                )}
                <li>Student payment portal deadlines will shift to {target.dueDate}.</li>
                {current && (
                  <li>
                    Outstanding promissory notes for {current.milestone} will lock for modification.
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
            <button type="button" onClick={onCancel} className={CANCEL_BUTTON_CLASS}>
              Cancel
            </button>
            <button type="button" onClick={onConfirm} className={PRIMARY_BUTTON_CLASS}>
              Confirm Change
            </button>
          </div>
        </>
      )}
    </AnimatedModal>
  );
}