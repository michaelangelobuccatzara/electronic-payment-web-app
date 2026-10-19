import { useId } from "react";
import type { PaymentRecord } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatPaymentMethods } from "../../utils/formatPaymentMethods";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";

const OVERLAY_CLASS = "backdrop-blur-xs p-4 duration-200";
const BOX_CLASS = "rounded-xl shadow-xl overflow-hidden duration-200";

interface ReceiptModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the content doesn't blank mid-animation. */
  payment: PaymentRecord | null;
  onClose: () => void;
}

export function ReceiptModal({ isOpen, payment, onClose }: ReceiptModalProps) {
  const titleId = useId();

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onClose}
      labelledBy={titleId}
      maxWidthClassName="max-w-xl"
      overlayClassName={OVERLAY_CLASS}
      boxClassName={BOX_CLASS}
    >
      {payment && (
        <>
          <div className="p-space-lg bg-surface-container-low flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold">
                <Icon name="receipt_long" className="text-headline-md" />
              </div>
              <h2
                id={titleId}
                className="font-title-sm text-title-sm font-bold text-on-surface leading-tight"
              >
                Institutional Electronic Receipt
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded-lg hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors"
            >
              <Icon name="close" className="text-body-lg" />
            </button>
          </div>

          <div className="p-space-lg space-y-space-md">
            <div className="pb-3 border-b border-surface-container-low">
              <span className="font-label-sm text-label-sm text-outline uppercase">
                Transaction Reference
              </span>
              <div className="font-data-tabular text-headline-md font-bold text-primary">
                {payment.paymentNumber}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm bg-background p-space-md rounded-lg">
              <div className="min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Student Payor
                </span>
                <div className="font-body-md text-body-md font-semibold text-on-surface wrap-break-word">
                  {payment.studentName}
                </div>
                <div className="font-data-tabular text-data-tabular text-outline">
                  ID: {payment.schoolId}
                </div>
              </div>
              <div className="min-w-0">
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Settlement Date
                </span>
                <div className="font-data-tabular text-data-tabular text-on-surface font-medium">
                  {formatDateTime(payment.paidAt)}
                </div>
                <div className="font-label-sm text-label-sm text-outline wrap-break-word">
                  {formatPaymentMethods(payment.paymentMethod)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase">Amount Paid</span>
              <span className="font-data-tabular text-headline-md font-bold text-on-surface">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>

          <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-surface-container-lowest text-on-surface font-label-md text-label-md rounded-lg shadow-xs hover:bg-surface-container transition-colors"
            >
              Dismiss
            </button>
            {/* No behavior yet: there is no download endpoint. */}
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-xs hover:bg-primary-container transition-colors"
            >
              <Icon name="download" className="text-body-lg" />
              <span>Download</span>
            </button>
          </div>
        </>
      )}
    </AnimatedModal>
  );
}