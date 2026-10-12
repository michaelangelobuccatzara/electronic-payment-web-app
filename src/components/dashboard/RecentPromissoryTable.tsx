import { Link } from "react-router-dom";
import { ROUTE_PATHS } from "../../data/navigation";
import type { PromissoryRequest, PromissoryStatus } from "../../types/types";
import { formatCurrency } from "../../utils/formatCurrency";
import { StatusBadge, type BadgeTone } from "../ui/StatusBadge";

interface RowPresentation {
  tone: BadgeTone;
  label: string;
  actionLabel: string;
  actionClassName: string;
}

const ROW_PRESENTATION: Record<PromissoryStatus, RowPresentation> = {
  pending: {
    tone: "pending",
    label: "Pending",
    actionLabel: "Review",
    actionClassName: "text-primary hover:text-primary-container",
  },
  approved: {
    tone: "success",
    label: "Approved",
    actionLabel: "View",
    actionClassName: "text-outline hover:text-on-surface",
  },
};

const CELL = "py-space-sm px-space-md";
const HEADER_CELL = `${CELL} font-semibold`;

interface RecentPromissoryTableProps {
  requests: readonly PromissoryRequest[];
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
          const row = ROW_PRESENTATION[request.status];
          return (
            <tr
              key={request.requestId}
              className="hover:bg-surface-container-low transition-colors font-body-md text-body-md"
            >
              <td className={`${CELL} font-data-tabular text-data-tabular font-medium text-on-surface`}>
                {request.requestId}
              </td>
              <td className={`${CELL} font-medium text-on-surface`}>
                {request.studentName}
              </td>
              <td className={`${CELL} font-body-sm text-body-sm text-on-surface-variant`}>
                {request.yearLevel}
              </td>
              <td className={`${CELL} font-data-tabular text-data-tabular font-semibold text-right text-on-surface`}>
                {formatCurrency(request.amountDue)}
              </td>
              <td className={`${CELL} text-center`}>
                <StatusBadge tone={row.tone} label={row.label} />
              </td>
              <td className={`${CELL} text-right`}>
                <Link
                  to={ROUTE_PATHS.promissoryNotes}
                  className={`font-body-sm text-body-sm font-semibold inline-flex items-center gap-0.5 ${row.actionClassName}`}
                >
                  {row.actionLabel}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}