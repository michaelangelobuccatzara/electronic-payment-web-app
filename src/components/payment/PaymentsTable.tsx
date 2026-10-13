import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_META } from "../../data/paymentOptions";
import type { PaymentTransaction } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { Icon } from "../ui/Icon";

const CELL = "py-3 px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface PaymentsTableProps {
  transactions: readonly PaymentTransaction[];
  onViewReceipt: (transaction: PaymentTransaction) => void;
}

export function PaymentsTable({ transactions, onViewReceipt }: PaymentsTableProps) {
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
        {transactions.length === 0 ? (
          <tr>
            <td colSpan={7} className={`${CELL} text-center text-on-surface-variant`}>
              No payments match your filters.
            </td>
          </tr>
        ) : (
          transactions.map((transaction) => {
            const status = PAYMENT_STATUS_META[transaction.status];
            return (
              <tr
                key={transaction.referenceNo}
                className="hover:bg-background/80 transition-colors"
              >
                <td className={CELL}>
                  <span className="font-data-tabular text-data-tabular font-bold text-primary">
                    {transaction.referenceNo}
                  </span>
                </td>
                <td className={CELL}>
                  <div className="font-semibold text-on-surface leading-snug">
                    {transaction.studentName}
                  </div>
                </td>
                <td className={CELL}>
                  <span className="font-data-tabular text-data-tabular text-on-surface-variant">
                    {transaction.studentNumber}
                  </span>
                </td>
                <td className={`${CELL} text-right`}>
                  <span className="font-data-tabular text-data-tabular font-bold text-on-surface">
                    {formatCurrency(transaction.amount)}
                  </span>
                </td>
                <td className={CELL}>
                  <div className="font-data-tabular text-data-tabular text-on-surface leading-tight">
                    {transaction.date}
                  </div>
                  <div className="font-label-sm text-label-sm text-outline">{transaction.time}</div>
                </td>
                <td className={CELL}>
                  <div className="flex items-center gap-1.5">
                    {/* The dot encodes the payment status, so screen readers get it as text. */}
                    <span
                      aria-hidden="true"
                      className={`w-2 h-2 rounded-full ${status.dotClassName}`}
                    />
                    <span className="sr-only">{status.label} payment: </span>
                    <span>{PAYMENT_METHOD_LABELS[transaction.method]}</span>
                  </div>
                </td>
                <td className={`${CELL} text-right`}>
                  <button
                    type="button"
                    onClick={() => onViewReceipt(transaction)}
                    aria-label={`View receipt ${transaction.referenceNo}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-primary hover:bg-surface-container-low rounded-xs font-label-md text-label-md font-semibold transition-colors"
                  >
                    <Icon name="receipt" className="text-body-sm" />
                    View Receipt
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}