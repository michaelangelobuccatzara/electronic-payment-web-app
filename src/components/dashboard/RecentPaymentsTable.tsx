import type { DashboardRecentPayment } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDateTime } from "../../utils/formatDateTime";

const CELL = "py-space-sm px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface RecentPaymentsTableProps {
  payments: DashboardRecentPayment[];
}

export function RecentPaymentsTable({ payments }: RecentPaymentsTableProps) {
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Recent payments</caption>
      <thead>
        <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
          <th scope="col" className={HEADER_CELL}>Ref #</th>
          <th scope="col" className={HEADER_CELL}>Student Name</th>
          <th scope="col" className={HEADER_CELL}>Year Level</th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>Amount</th>
          <th scope="col" className={HEADER_CELL}>Date</th>
        </tr>
      </thead>
      <tbody className="divide-y-0 text-on-surface">
        {payments.map((payment) => {
          return (
            <tr
              key={payment.paymentNumber}
              className="hover:bg-surface-container-low transition-colors font-body-md text-body-md"
            >
              <td className={`${CELL} font-data-tabular text-data-tabular font-medium text-on-surface`}>
                {payment.paymentNumber}
              </td>
              <td className={`${CELL} font-medium text-on-surface`}>
                {payment.studentName}
              </td>
              <td className={`${CELL} font-body-sm text-body-sm text-on-surface-variant`}>
                {payment.yearLevel}
              </td>
              <td className={`${CELL} font-data-tabular text-data-tabular font-semibold text-right text-on-surface`}>
                {formatCurrency(payment.amount)}
              </td>
              <td className={`${CELL} font-body-sm text-body-sm text-outline`}>
                {formatDateTime(payment.date)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}