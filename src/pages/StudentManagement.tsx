import { useState } from "react";
import type { YearFilter } from "../data/studentOptions";
import type { NewStudentDraft, Student, StudentEdits } from "../types/types";
import { AddStudentModal } from "../components/student/AddStudentModal";
import { DeleteStudentModal } from "../components/student/DeleteStudentModal";
import { StudentTable } from "../components/student/StudentTable";
import { StudentToolbar } from "../components/student/StudentToolbar";
import { Icon } from "../components/ui/Icon";
import { Pagination } from "../components/ui/Pagination";
import { EditStudentModal } from "../components/student/EditStudentModal";

const PAGE_SIZE = 6;

interface StudentManagementProps {
  /** Seed data. The page edits its own copy in memory until a data source exists. */
  initialStudents: readonly Student[];
  totalStudents: number;
}

export function StudentManagement({
  initialStudents,
  totalStudents,
}: StudentManagementProps) {
  const [students, setStudents] = useState<readonly Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState<YearFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // The "active" and "target" numbers stay set after closing, so the dialogs keep their content
  // while they animate out. The `isOpen` flags control visibility.
  const [deleteTargetNumber, setDeleteTargetNumber] = useState<string | null>(
    null,
  );
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [editNumber, setEditNumber] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Derived during render: no extra state or effects.
  const query = searchQuery.trim().toLowerCase();
  const visibleStudents = students.filter((student) => {
    const matchesSearch =
      query === "" ||
      student.studentId.toLowerCase().includes(query) ||
      student.fullName.toLowerCase().includes(query);
    const matchesYear =
      yearFilter === "all" || student.yearLevel === yearFilter;
    return matchesSearch && matchesYear;
  });
  const editStudent =
    students.find((student) => student.studentId === editNumber) ?? null;

  const totalPages = Math.ceil(totalStudents / PAGE_SIZE);
  const rangeStart = (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, totalStudents);

  const requestDelete = (student: Student) => {
    setDeleteTargetNumber(student.studentId);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    setStudents((previous) =>
      previous.filter((student) => student.studentId !== deleteTargetNumber),
    );
    setIsDeleteOpen(false);
  };

  const addStudent = (draft: NewStudentDraft) => {
    const newStudent: Student = {
      ...draft,
      status: "enrolled",
      balance: 0,
    };
    setStudents((previous) => [newStudent, ...previous]);
    setIsAddOpen(false);
  };
  const openEditModal = (student: Student) => {
    setEditNumber(student.studentId);
    setIsEditOpen(true);
  };

  // Receives the student number (the record's id) and the edited values.
  const handleUpdate = (studentNumber: string, edits: StudentEdits) => {
    setStudents((previous) =>
      previous.map((student) =>
        student.studentId === studentNumber
          ? { ...student, ...edits }
          : student,
      ),
    );
    setIsEditOpen(false);
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
        yearFilter={yearFilter}
        onYearFilterChange={setYearFilter}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto w-full">
          <StudentTable
            students={visibleStudents}
            onEdit={openEditModal}
            onDelete={requestDelete}
          />
        </div>
        <Pagination
          variant="compact"
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          totalItems={totalStudents}
          itemLabel="students"
          onPageChange={setCurrentPage}
        />
      </div>

      <EditStudentModal
        isOpen={isEditOpen}
        student={editStudent}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdate}
      />

      <AddStudentModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={addStudent}
      />

      <DeleteStudentModal
        isOpen={isDeleteOpen}
        studentNumber={deleteTargetNumber}
        onCancel={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
