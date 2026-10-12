import { ROUTE_PATHS } from "../data/navigation";
import type {
  DashboardSummary,
  Payment,
  PromissoryRequest,
} from "../types/types";
import { formatCurrency } from "../utils/formatCurrency";
import { DashboardPanel } from "../components/dashboard/DashboardPanel";
import { RecentPaymentsTable } from "../components/dashboard/RecentPaymentsTable";
import { RecentPromissoryTable } from "../components/dashboard/RecentPromissoryTable";
import { StatCard } from "../components/dashboard/StatCard";
import { Icon } from "../components/ui/Icon";
import { StatusBadge } from "../components/ui/StatusBadge";

interface AdminDashboardProps {
  firstName: string;
  summary: DashboardSummary;
  recentPayments: readonly Payment[];
  recentPromissoryRequests: readonly PromissoryRequest[];
}

const numberFormatter = new Intl.NumberFormat("en-US");

export function AdminDashboard({
  firstName,
  summary,
  recentPayments,
  recentPromissoryRequests,
}: AdminDashboardProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="mb-space-xl">
        <div className="flex items-center gap-space-xs mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Bursar Operational Hub
          </span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
          Welcome back, {firstName}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Overview of school finance and administrative activity for today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md mb-space-xl">
        <StatCard
          label="Total Students"
          value={numberFormatter.format(summary.totalStudents)}
          caption="Enrolled this term"
          accessory={<Icon name="school" className="text-title-sm text-outline" />}
        />
        <StatCard
          label="Total Staff"
          value={numberFormatter.format(summary.totalStaff)}
          caption="Active academic & admin"
          accessory={<Icon name="badge" className="text-title-sm text-outline" />}
        />
        <StatCard
          label="Promissory Requests"
          value={numberFormatter.format(summary.pendingPromissoryRequests)}
          caption="Awaiting approval"
          valueTone="tertiary"
          accessory={<StatusBadge tone="pending" label="Requires Review" />}
        />
        <StatCard
          label="Payments Collected"
          value={formatCurrency(summary.paymentsCollected)}
          caption="This semester"
          valueTone="primary"
          accessory={<Icon name="payments" className="text-title-sm text-primary" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-space-lg items-start">
        <DashboardPanel
          title="Recent Payments"
          iconName="receipt_long"
          iconClassName="text-primary"
          viewAllTo={ROUTE_PATHS.payments}
        >
          <RecentPaymentsTable payments={recentPayments} />
        </DashboardPanel>

        <DashboardPanel
          title="Recent Promissory Requests"
          iconName="history_edu"
          iconClassName="text-tertiary"
          viewAllTo={ROUTE_PATHS.promissoryNotes}
        >
          <RecentPromissoryTable requests={recentPromissoryRequests} />
        </DashboardPanel>
      </div>
    </div>
  );
}