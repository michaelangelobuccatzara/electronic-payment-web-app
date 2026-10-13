import { useId } from "react";
import { STUDENT_STATUS_LABELS } from "../../data/studentOptions";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { Student, StudentEdits } from "../../types/types";
import { getInitials } from "../../utils/getInitials";
import { Icon } from "../ui/Icon";
import { StatusBadge } from "../ui/StatusBadge";
import { EditStudentForm } from "./EditStudentForm";
import { SECONDARY_BUTTON_CLASS } from "./StudentFormControls";
import { StudentOverview } from "./StudentOverview";

export type DrawerTab = "overview" | "edit";

const TAB_BASE = "flex-1 py-1.5 rounded-md font-title-sm text-body-sm";
const TAB_ACTIVE = "font-semibold bg-surface-container-lowest text-on-surface shadow-xs";
const TAB_INACTIVE = "font-medium text-outline hover:text-on-surface";

interface StudentDrawerProps {
  /** Stays set while the drawer slides out, so its content doesn't vanish mid-animation. */
  student: Student | null;
  isOpen: boolean;
  tab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  onClose: () => void;
  onSave: (edits: StudentEdits) => void;
}

export function StudentDrawer({
  student,
  isOpen,
  tab,
  onTabChange,
  onClose,
  onSave,
}: StudentDrawerProps) {
  const baseId = useId();
  const titleId = `${baseId}-title`;
  const ids = {
    overviewTab: `${baseId}-tab-overview`,
    editTab: `${baseId}-tab-edit`,
    panel: `${baseId}-panel`,
  };

  useEscapeKey(isOpen, onClose);

  return (
    <div
      inert={!isOpen}
      onClick={(event) => {
        // Only a click on the backdrop itself closes it, not clicks bubbling up from the panel.
        if (event.target === event.currentTarget) onClose();
      }}
      className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute right-0 top-0 h-full w-full max-w-xl bg-surface-container-lowest shadow-2xl transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {student && (
          <>
            <div className="p-space-lg bg-surface-container-low flex items-start justify-between">
              <div className="flex items-center gap-space-md">
                <div
                  aria-hidden="true"
                  className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center font-headline-md text-headline-md font-bold shadow-xs"
                >
                  {getInitials(student.fullName)}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-data-tabular text-data-tabular font-bold text-primary">
                      {student.studentNumber}
                    </span>
                    <StatusBadge
                      tone="success"
                      label={STUDENT_STATUS_LABELS[student.status]}
                      showDot={false}
                    />
                  </div>
                  <h2
                    id={titleId}
                    className="font-headline-md text-headline-md font-bold text-on-surface mt-0.5"
                  >
                    {student.fullName}
                  </h2>
                  <span className="font-body-sm text-body-sm text-outline">
                    {student.program} • {student.yearLevel}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              >
                <Icon name="close" className="text-headline-md" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-space-lg flex flex-col gap-space-lg">
              <div
                role="tablist"
                aria-label="Student record"
                className="flex items-center gap-1 bg-surface-container-low p-1 rounded-lg"
              >
                <button
                  type="button"
                  role="tab"
                  id={ids.overviewTab}
                  aria-selected={tab === "overview"}
                  aria-controls={ids.panel}
                  onClick={() => onTabChange("overview")}
                  className={`${TAB_BASE} ${tab === "overview" ? TAB_ACTIVE : TAB_INACTIVE}`}
                >
                  Inspect Record
                </button>
                <button
                  type="button"
                  role="tab"
                  id={ids.editTab}
                  aria-selected={tab === "edit"}
                  aria-controls={ids.panel}
                  onClick={() => onTabChange("edit")}
                  className={`${TAB_BASE} ${tab === "edit" ? TAB_ACTIVE : TAB_INACTIVE}`}
                >
                  Edit Profile
                </button>
              </div>

              <div
                role="tabpanel"
                id={ids.panel}
                aria-labelledby={tab === "overview" ? ids.overviewTab : ids.editTab}
              >
                {tab === "overview" ? (
                  <StudentOverview student={student} />
                ) : (
                  <EditStudentForm
                    student={student}
                    onSave={onSave}
                    onCancel={() => onTabChange("overview")}
                  />
                )}
              </div>
            </div>

            <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
              {student.lastModified && (
                <span className="font-label-sm text-label-sm text-outline">
                  Last modified: {student.lastModified}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className={`${SECONDARY_BUTTON_CLASS} ml-auto py-1.5`}
              >
                Dismiss
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}