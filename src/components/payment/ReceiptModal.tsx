import { useId } from "react";
import {
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_META,
} from "../../data/paymentOptions";
import type { PaymentTransaction } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";

const OVERLAY_CLASS = "backdrop-blur-xs p-4 duration-200";
const BOX_CLASS = "rounded-xl shadow-xl overflow-hidden duration-200";

interface ReceiptModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the content doesn't blank mid-animation. */
  transaction: PaymentTransaction | null;
  onClose: () => void;
}

export function ReceiptModal({ isOpen, transaction, onClose }: ReceiptModalProps) {
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
      {transaction && (
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
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Transaction Reference
                </span>
                <div className="font-data-tabular text-headline-md font-bold text-primary">
                  {transaction.referenceNo}
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-outline uppercase">Status</span>
                <div className="mt-0.5">
                  <StatusBadge
                    tone={PAYMENT_STATUS_META[transaction.status].tone}
                    label={PAYMENT_STATUS_META[transaction.status].receiptLabel}
                    size="md"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-space-sm bg-background p-space-md rounded-lg">
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Student Payor
                </span>
                <div className="font-body-md text-body-md font-semibold text-on-surface">
                  {transaction.studentName}
                </div>
                <div className="font-data-tabular text-data-tabular text-outline">
                  ID: {transaction.studentNumber}
                </div>
              </div>
              <div>
                <span className="font-label-sm text-label-sm text-outline uppercase">
                  Settlement Date
                </span>
                <div className="font-data-tabular text-data-tabular text-on-surface font-medium">
                  {transaction.date} {transaction.time}
                </div>
                <div className="font-label-sm text-label-sm text-outline truncate">
                  {PAYMENT_METHOD_LABELS[transaction.method]}
                </div>
              </div>
            </div>

            {/* Added: the source's receipt had no amount element. */}
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-outline uppercase">Amount Paid</span>
              <span className="font-data-tabular text-headline-md font-bold text-on-surface">
                {formatCurrency(transaction.amount)}
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
            {/* No behavior in the source (it only showed an alert). */}
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