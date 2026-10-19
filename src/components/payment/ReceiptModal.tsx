import { useCallback, useId } from "react";
import { useApiQuery } from "../../hooks/useApiQuery";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatPaymentMethods } from "../../utils/formatPaymentMethods";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { paymentService } from "./paymentService";

const OVERLAY_CLASS = "backdrop-blur-xs p-4 duration-200";
const BOX_CLASS = "rounded-xl shadow-xl overflow-hidden duration-200";

interface ReceiptBodyProps {
  paymentId: string;
}

/** Loads and shows one payment. Remounted per payment (via `key`), so each id gets a fresh fetch. */
function ReceiptBody({ paymentId }: ReceiptBodyProps) {
  const fetchPayment = useCallback(
    (signal: AbortSignal) => paymentService.getById(paymentId, signal),
    [paymentId],
  );
  const { data: payment, error, isLoading, reload } = useApiQuery(fetchPayment);

  return (
    <div aria-busy={isLoading} className="p-space-lg space-y-space-md">
      {error !== null && <ErrorAlert message={error} onRetry={reload} />}

      {payment === undefined ? (
        isLoading && (
          <p role="status" className="font-body-md text-body-md text-on-surface-variant">
            Loading receipt…
          </p>
        )
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

interface ReceiptModalProps {
  isOpen: boolean;
  /**
   * Keep it set while the modal fades out, so the content doesn't blank mid-animation.
   * `null` only before the first receipt has ever been opened.
   */
  paymentId: string | null;
  onClose: () => void;
}

export function ReceiptModal({ isOpen, paymentId, onClose }: ReceiptModalProps) {
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

      {paymentId !== null && <ReceiptBody key={paymentId} paymentId={paymentId} />}
    </AnimatedModal>
  );
}