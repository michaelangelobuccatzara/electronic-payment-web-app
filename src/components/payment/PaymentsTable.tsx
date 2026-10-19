import type { PaymentRecord } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";
import { formatPaymentMethods } from "../../utils/formatPaymentMethods";
import { Icon } from "../ui/Icon";

const CELL = "py-3 px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface PaymentsTableProps {
  payments: readonly PaymentRecord[];
  emptyMessage: string;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export function PaymentsTable({ payments, emptyMessage, onViewReceipt }: PaymentsTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">Payment transactions</caption>
      <thead>
        <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider select-none">
          <th scope="col" className={HEADER_CELL}>Payment Reference</th>
          <th scope="col" className={HEADER_CELL}>Student Name</th>
          <th scope="col" className={HEADER_CELL}>Student ID</th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>Amount</th>
          <th scope="col" className={HEADER_CELL}>Payment Date</th>
          <th scope="col" className={HEADER_CELL}>Method</th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container-low font-body-md text-body-md text-on-surface">
        {payments.length === 0 ? (
          <tr>
            <td colSpan={7} className={`${CELL} text-center text-on-surface-variant`}>
              {emptyMessage}
            </td>
          </tr>
        ) : (
          payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-background/80 transition-colors">
              <td className={CELL}>
                <span className="font-data-tabular text-data-tabular font-bold text-primary">
                  {payment.paymentNumber}
                </span>
              </td>
              <td className={CELL}>
                <div className="font-semibold text-on-surface leading-snug">
                  {payment.studentName}
                </div>
              </td>
              <td className={CELL}>
                <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                  {payment.schoolId}
                </span>
              </td>
              <td className={`${CELL} text-right`}>
                <span className="font-data-tabular text-data-tabular font-bold text-on-surface">
                  {formatCurrency(payment.amount)}
                </span>
              </td>
              <td className={CELL}>
                <span className="font-data-tabular text-data-tabular text-on-surface">
                  {formatDateTime(payment.paidAt)}
                </span>
              </td>
              <td className={CELL}>{formatPaymentMethods(payment.paymentMethod)}</td>
              <td className={`${CELL} text-right`}>
                <button
                  type="button"
                  onClick={() => onViewReceipt(payment)}
                  aria-label={`View receipt ${payment.paymentNumber}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-primary hover:bg-surface-container-low rounded-xs font-label-md text-label-md font-semibold transition-colors"
                >
                  <Icon name="receipt" className="text-body-sm" />
                  View Receipt
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}