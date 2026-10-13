import { STUDENT_STATUS_LABELS } from "../../data/studentOptions";
import type { Student } from "../../types/types";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";

interface RowActionProps {
  icon: string;
  label: string;
  target: string;
  hoverClassName: string;
  onClick: () => void;
}

function RowAction({ icon, label, target, hoverClassName, onClick }: RowActionProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={`${label}: ${target}`}
      onClick={onClick}
      className={`p-1.5 rounded-md text-outline transition-colors ${hoverClassName}`}
    >
      <Icon name={icon} className="text-body-lg" />
    </button>
  );
}

interface StudentTableProps {
  students: readonly Student[];
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export function StudentTable({ students, onEdit, onDelete }: StudentTableProps) {
  return (
    <table className="w-full text-left border-collapse">
      <caption className="sr-only">Students</caption>
      <thead>
        <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider">
          <th scope="col" className="py-3 px-space-lg font-semibold">Student ID</th>
          <th scope="col" className="py-3 px-space-md font-semibold">Full Name</th>
          <th scope="col" className="py-3 px-space-md font-semibold">Year Level</th>
          <th scope="col" className="py-3 px-space-md text-center font-semibold">Status</th>
          <th scope="col" className="py-3 px-space-lg text-right font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody className="font-body-sm text-body-sm text-on-surface">
        {students.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-3.5 px-space-lg text-center text-on-surface-variant">
              No students match your search.
            </td>
          </tr>
        ) : (
          students.map((student) => (
            <tr
              key={student.studentId}
              className="hover:bg-surface-container-low/60 transition-colors"
            >
              <td className="py-3.5 px-space-lg font-data-tabular text-data-tabular font-semibold text-primary">
                {student.studentId}
              </td>
              <td className="py-3.5 px-space-md">
                {/* ml-2 is a leftover from the avatar the source removed; delete it to align with the header. */}
                <div className="flex flex-col ml-2">
                  <span className="font-medium text-on-surface">{student.fullName}</span>
                  <span className="font-label-sm text-label-sm text-outline">{student.email}</span>
                </div>
              </td>
              <td className="py-3.5 px-space-md text-on-surface-variant">{student.yearLevel}</td>
              <td className="py-3.5 px-space-md text-center">
                <StatusBadge tone="neutral" label={STUDENT_STATUS_LABELS[student.status]} />
              </td>
              <td className="py-3.5 px-space-lg text-right">
                <div className="inline-flex items-center gap-1">
                  <RowAction
                    icon="edit"
                    label="Edit student"
                    target={student.fullName}
                    hoverClassName="hover:bg-surface-container hover:text-on-surface"
                    onClick={() => onEdit(student)}
                  />
                  <RowAction
                    icon="delete"
                    label="Delete record"
                    target={student.fullName}
                    hoverClassName="hover:bg-error-container hover:text-error"
                    onClick={() => onDelete(student)}
                  />
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}