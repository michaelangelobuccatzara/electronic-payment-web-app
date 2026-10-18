import { useCallback, useState } from "react";
import { AddStudentModal } from "../components/student/AddStudentModal";
import { StudentTable } from "../components/student/StudentTable";
import { StudentToolbar } from "../components/student/StudentToolbar";
import { studentService } from "../components/student/studentService";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { useApiQuery } from "../hooks/useApiQuery";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { EditStudentModal } from "../components/student/EditStudentModal";
import type { AddStudent, StudentRecord, UpdateStudent } from "../types/types";
import { DeleteStudentModal } from "../components/student/DeleteStudentModal";

export function StudentManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const searchTerm = useDebouncedValue(searchQuery.trim(), 300);

  const [isEditOpen, setIsEditOpen] = useState(false);
  // Stays set after closing, so the modal keeps its content while it fades out.
  const [studentToEdit, setStudentToEdit] = useState<StudentRecord | null>(
    null,
  );

  const openEditModal = (student: StudentRecord) => {
    setStudentToEdit(student);
    setIsEditOpen(true);
  };
  const closeEditModal = () => setIsEditOpen(false);

  // A new search starts from page 1 (adjusted during render, so no extra request fires).
  const [pageSearchTerm, setPageSearchTerm] = useState(searchTerm);
  if (pageSearchTerm !== searchTerm) {
    setPageSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const fetchStudents = useCallback(
    (signal: AbortSignal) =>
      studentService.getPagination(currentPage, searchTerm, signal),
    [currentPage, searchTerm],
  );
  const { data, error, isLoading, reload } = useApiQuery(fetchStudents);

  const rangeStart =
    data && data.totalCount > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const rangeEnd = data
    ? Math.min(data.page * data.pageSize, data.totalCount)
    : 0;

  // Errors propagate to the modal, which displays them. Close and refresh only on success.
  const addStudent = async (student: AddStudent) => {
    await studentService.addStudent(student);
    setIsAddOpen(false);
    reload();
  };

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  // Stays set after closing, so the modal keeps its content while it fades out.
  const [studentToDelete, setStudentToDelete] = useState<StudentRecord | null>(
    null,
  );

  const requestDelete = (student: StudentRecord) => {
    setStudentToDelete(student);
    setIsDeleteOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteOpen(false);

  const handleConfirmDelete = async () => {
    if (studentToDelete === null) return;
    await studentService.deleteStudent(studentToDelete.id);
    closeDeleteModal();

    // Removing the only row on the last page would leave an empty page.
    if (data !== undefined && data.items.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1); // changes the query, which refetches by itself
    } else {
      reload();
    }
  };
  // Errors propagate to the modal, which displays them. Close and refresh only on success.
  const handleUpdate = async (id: string, update: UpdateStudent) => {
    await studentService.updateStudent(id, update);
    closeEditModal();
    reload();
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Registrar &amp; Bursar Database
          </span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-0.5">
            Student Management
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            View student enrollment records, course assignments, and account
            balances.
          </p>
        </div>
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            aria-haspopup="dialog"
            className="px-space-md py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg shadow-xs hover:bg-primary transition-colors flex items-center gap-1.5"
          >
            <Icon name="person_add" className="text-body-lg" />+ Add Student
          </button>
        </div>
      </div>

      <StudentToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {error !== null && <ErrorAlert message={error} onRetry={reload} />}

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div
          aria-busy={isLoading}
          className={`overflow-x-auto w-full transition-opacity ${
            isLoading && data !== undefined ? "opacity-60" : ""
          }`}
        >
          {data === undefined ? (
            isLoading && (
              <p
                role="status"
                className="p-space-lg font-body-md text-body-md text-on-surface-variant"
              >
                Loading students…
              </p>
            )
          ) : (
            <StudentTable
              students={data.items}
              emptyMessage={
                searchTerm === ""
                  ? "No students enrolled yet."
                  : "No students match your search."
              }
              onEdit={openEditModal}
              onDelete={requestDelete}
            />
          )}
        </div>
        {data !== undefined && (
          <Pagination
            variant="compact"
            currentPage={data.page}
            totalPages={data.totalPages}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            totalItems={data.totalCount}
            itemLabel="students"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addStudent}
      />

      <EditStudentModal
        isOpen={isEditOpen}
        student={studentToEdit}
        onClose={closeEditModal}
        onUpdate={handleUpdate}
      />

      <DeleteStudentModal
        isOpen={isDeleteOpen}
        student={studentToDelete}
        onCancel={closeDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
