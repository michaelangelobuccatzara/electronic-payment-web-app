import { useEffect, useState } from "react";
import {
  type AddStaff,
  type PagedResult,
  type StaffMember,
  type UpdateStaff,
} from "../types/types";
import { AddStaffDrawer } from "../components/staff/AddStaffDrawer";
import { RevokeAccessDialog } from "../components/staff/RevokeAccessDialog";
import { StaffTable } from "../components/staff/StaffTable";
import { StaffToolbar } from "../components/staff/StaffToolbar";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { EditStaffModal } from "../components/staff/EditStaffModal";
import { staffService } from "../components/staff/staffService";

export function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [staffToRevoke, setStaffToRevoke] = useState<StaffMember | null>(null);
  const [pagination, setPagination] = useState<PagedResult<StaffMember>>({
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<StaffMember | null>(null);

  // Derived during render: no extra state or effect needed.
  const query = searchQuery.trim().toLowerCase();
  const visibleStaff =
    query === ""
      ? pagination.items
      : pagination.items.filter((member) =>
          [member.firstName, member.middleName, member.username].some((field) =>
            field.toLowerCase().includes(query),
          ),
        );

  const rangeStart = (pagination.page - 1) * pagination.pageSize + 1;
  const rangeEnd = Math.min(
    pagination.page * pagination.pageSize,
    pagination.totalCount,
  );

  const closeAddDrawer = () => setIsAddDrawerOpen(false);
  const closeRevokeDialog = () => setStaffToRevoke(null);
  const mount = () => setIsMounted((value) => !value);

  // Persisting the new account / revoking access needs a data source, which isn't decided yet.
  const handleSaveStaff = async (draft: AddStaff) => {
    try {
      await staffService.addStaff(draft);
    } catch (err) {
      throw err;
    } finally {
      closeAddDrawer();
      mount();
    }
  };
  const handleConfirmRevoke = async () => {
    try {
      await staffService.revokeStaff(staffToRevoke?.id!);
    } catch (err) {
      throw err;
    } finally {
      closeRevokeDialog();
      mount();
    }
  };

  const openEditModal = (member: StaffMember) => {
    setMemberToEdit(member);
    setIsEditOpen(true);
  };
  const closeEditModal = () => setIsEditOpen(false);

  // Receives the id of the staff member that was edited.
  const handleUpdate = async (id: string, updateStaff: UpdateStaff) => {
    try {
      await staffService.updateStaff(id, updateStaff);
    } catch (err) {
      throw err;
    } finally {
      closeEditModal();
      mount();
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        setPagination(
          await staffService.getPagination(currentPage, searchQuery),
        );
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [isMounted, currentPage]);

  if (loading) return <div>Loading ...</div>;

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
            Manage authorized school personnel, administrative roles, and system
            access.
          </p>
        </div>
      </div>

      <StaffToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddClick={() => setIsAddDrawerOpen(true)}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col w-full">
        <div className="overflow-x-auto">
          <StaffTable
            staff={visibleStaff}
            onEdit={openEditModal}
            onRevoke={setStaffToRevoke}
          />

          <EditStaffModal
            isOpen={isEditOpen}
            member={memberToEdit}
            onClose={closeEditModal}
            onUpdate={handleUpdate}
          />
        </div>
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={pagination.totalCount}
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
