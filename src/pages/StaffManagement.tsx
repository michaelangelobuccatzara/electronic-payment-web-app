import { useCallback, useState } from "react";
import type { AddStaff, StaffMember, UpdateStaff } from "../types/types";
import { AddStaffDrawer } from "../components/staff/AddStaffDrawer";
import { RevokeAccessDialog } from "../components/staff/RevokeAccessDialog";
import { StaffTable } from "../components/staff/StaffTable";
import { StaffToolbar } from "../components/staff/StaffToolbar";
import { EditStaffModal } from "../components/staff/EditStaffModal";
import { staffService } from "../components/staff/staffService";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { useApiQuery } from "../hooks/useApiQuery";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

export function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [staffToRevoke, setStaffToRevoke] = useState<StaffMember | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<StaffMember | null>(null);

  const searchTerm = useDebouncedValue(searchQuery.trim(), 300);

  // A new search starts from page 1. Adjusting state during render (the same pattern as your
  // modals) means the request below never fires with the new term and the old page.
  const [pageSearchTerm, setPageSearchTerm] = useState(searchTerm);
  if (pageSearchTerm !== searchTerm) {
    setPageSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const fetchStaff = useCallback(
    (signal: AbortSignal) =>
      staffService.getPagination(currentPage, searchTerm, signal),
    [currentPage, searchTerm],
  );
  const { data, error, isLoading, reload } = useApiQuery(fetchStaff);

  const rangeStart = data && data.totalCount > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const rangeEnd = data ? Math.min(data.page * data.pageSize, data.totalCount) : 0;

  const closeAddDrawer = () => setIsAddDrawerOpen(false);
  const closeRevokeDialog = () => setStaffToRevoke(null);
  const closeEditModal = () => setIsEditOpen(false);

  const openEditModal = (member: StaffMember) => {
    setMemberToEdit(member);
    setIsEditOpen(true);
  };

  // The handlers below let errors propagate. The drawer/modals catch them and show the message,
  // and these only close the UI and refresh after a successful request.
  const handleSaveStaff = async (draft: AddStaff) => {
    await staffService.addStaff(draft);
    closeAddDrawer();
    reload();
  };

  const handleUpdate = async (id: string, updateStaff: UpdateStaff) => {
    await staffService.updateStaff(id, updateStaff);
    closeEditModal();
    reload();
  };

  const handleConfirmRevoke = async () => {
    if (staffToRevoke === null) return;
    await staffService.revokeStaff(staffToRevoke.id);
    closeRevokeDialog();

    // Removing the only row on the last page would leave an empty page.
    if (data !== undefined && data.items.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1); // changes the query, which refetches by itself
    } else {
      reload();
    }
  };

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
      </div>

      <StaffToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsAddDrawerOpen(true)}
      />

      {error !== null && <ErrorAlert message={error} onRetry={reload} />}

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col w-full">
        <div
          aria-busy={isLoading}
          className={`overflow-x-auto transition-opacity ${
            isLoading && data !== undefined ? "opacity-60" : ""
          }`}
        >
          {data === undefined ? (
            isLoading && (
              <p role="status" className="p-space-lg font-body-md text-body-md text-on-surface-variant">
                Loading staff…
              </p>
            )
          ) : (
            <StaffTable staff={data.items} onEdit={openEditModal} onRevoke={setStaffToRevoke} />
          )}

          <EditStaffModal
            isOpen={isEditOpen}
            member={memberToEdit}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        </div>

        {data !== undefined && (
          <Pagination
            currentPage={data.page}
            totalPages={data.totalPages}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={data.totalCount}
            itemLabel="staff members"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddStaffDrawer isOpen={isAddDrawerOpen} onClose={closeAddDrawer} onSave={handleSaveStaff} />

      <RevokeAccessDialog
        member={staffToRevoke}
        onCancel={closeRevokeDialog}
        onConfirm={handleConfirmRevoke}
      />
    </div>
  );
}