import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../data/navigation";
import { PROMISSORY_STATUS_META } from "../../data/promissoryOptions";
import type { DashboardRecentPromissory } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { StatusBadge } from "../ui/StatusBadge";

const CELL = "py-space-sm px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface RecentPromissoryTableProps {
  requests: readonly DashboardRecentPromissory[];
}

export function RecentPromissoryTable({ requests }: RecentPromissoryTableProps) {
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Recent promissory requests</caption>
      <thead>
        <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
          <th scope="col" className={HEADER_CELL}>Request ID</th>
          <th scope="col" className={HEADER_CELL}>Student Name</th>
          <th scope="col" className={HEADER_CELL}>Year Level</th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>Amount Due</th>
          <th scope="col" className={`${HEADER_CELL} text-center`}>Status</th>
          <th scope="col" className={`${HEADER_CELL} text-right`}>Action</th>
        </tr>
      </thead>
      <tbody className="divide-y-0 text-on-surface">
        {requests.map((request) => {
          const meta = PROMISSORY_STATUS_META[request.status];
          const needsReview = request.status === "Pending";
          return (
            <tr
              key={request.promissoryNumber}
              className="hover:bg-surface-container-low transition-colors font-body-md text-body-md"
            >
              <td className={`${CELL} font-data-tabular text-data-tabular font-medium text-on-surface`}>
                {request.promissoryNumber}
              </td>
              <td className={`${CELL} font-medium text-on-surface`}>{request.studentName}</td>
              <td className={`${CELL} font-body-sm text-body-sm text-on-surface-variant`}>
                {request.yearLevel}
              </td>
              <td className={`${CELL} font-data-tabular text-data-tabular font-semibold text-right text-on-surface`}>
                {formatCurrency(request.requestedAmount)}
              </td>
              <td className={`${CELL} text-center`}>
                <StatusBadge tone={meta.tone} label={meta.label} />
              </td>
              <td className={`${CELL} text-right`}>
                <Link
                  to={ROUTE_PATHS.promissoryNotes}
                  className={`font-body-sm text-body-sm font-semibold inline-flex items-center gap-0.5 ${
                    needsReview
                      ? "text-primary hover:text-primary-container"
                      : "text-outline hover:text-on-surface"
                  }`}
                >
                  {needsReview ? "Review" : "View"}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}