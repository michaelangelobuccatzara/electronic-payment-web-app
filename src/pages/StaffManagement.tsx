import { useState } from "react";
import type { StaffMember, StaffSummary } from "../types/types";
import { AddStaffDrawer } from "../components/staff/AddStaffDrawer";
import { QuickStat } from "../components/staff/QuickStat";
import { RevokeAccessDialog } from "../components/staff/RevokeAccessDialog";
import { StaffTable } from "../components/staff/StaffTable";
import { StaffToolbar } from "../components/staff/StaffToolbar";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";

const PAGE_SIZE = 6;

interface StaffManagementProps {
  staff: readonly StaffMember[];
  summary: StaffSummary;
}

export function StaffManagement({
  staff,
  summary,
}: StaffManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [staffToRevoke, setStaffToRevoke] = useState<StaffMember | null>(null);

  // Derived during render: no extra state or effect needed.
  const query = searchQuery.trim().toLowerCase();
  const visibleStaff =
    query === ""
      ? staff
      : staff.filter((member) =>
          [member.staffId, member.fullName, member.email].some((field) =>
            field.toLowerCase().includes(query),
          ),
        );

  const totalItems = summary.totalPersonnel;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, totalItems);

  const closeAddDrawer = () => setIsAddDrawerOpen(false);
  const closeRevokeDialog = () => setStaffToRevoke(null);

  // Persisting the new account / revoking access needs a data source, which isn't decided yet.
  const handleSaveStaff = () => closeAddDrawer();
  const handleConfirmRevoke = () => closeRevokeDialog();

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col">
          <div className="flex items-center gap-space-xs text-secondary mb-1">
            <Icon name="shield_person" className="text-body-md" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              Institutional Governance
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Staff Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage authorized school personnel, administrative roles, and system access.
          </p>
        </div>

        <div className="flex items-center gap-space-md self-start md:self-auto">
          <QuickStat label="Total Personnel" value={summary.totalPersonnel} icon="badge" tone="neutral" />
          <QuickStat label="Active Accounts" value={summary.activeAccounts} icon="verified_user" tone="success" />
        </div>
      </div>

      <StaffToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsAddDrawerOpen(true)}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <StaffTable staff={visibleStaff} onRevoke={setStaffToRevoke} />
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={totalItems}
          itemLabel="staff members"
          onPageChange={setCurrentPage}
        />
      </div>

      <AddStaffDrawer
        isOpen={isAddDrawerOpen}
        onClose={closeAddDrawer}
        onSave={handleSaveStaff}
      />

      <RevokeAccessDialog
        member={staffToRevoke}
        onCancel={closeRevokeDialog}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}