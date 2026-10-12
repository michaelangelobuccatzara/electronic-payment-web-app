import type { Payment, PaymentStatus } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { StatusBadge, type BadgeTone } from "../ui/StatusBadge";

const STATUS_BADGES: Record<PaymentStatus, { tone: BadgeTone; label: string }> = {
  successful: { tone: "success", label: "Successful" },
  pending: { tone: "pending", label: "Pending" },
};

const CELL = "py-space-sm px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface RecentPaymentsTableProps {
  payments: readonly Payment[];
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
          <th scope="col" className={`${HEADER_CELL} text-center`}>Status</th>
        </tr>
      </thead>
      <tbody className="divide-y-0 text-on-surface">
        {payments.map((payment) => {
          const badge = STATUS_BADGES[payment.status];
          return (
            <tr
              key={payment.referenceNo}
              className="hover:bg-surface-container-low transition-colors font-body-md text-body-md"
            >
              <td className={`${CELL} font-data-tabular text-data-tabular font-medium text-on-surface`}>
                {payment.referenceNo}
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
                {payment.date}
              </td>
              <td className={`${CELL} text-center`}>
                <StatusBadge tone={badge.tone} label={badge.label} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}