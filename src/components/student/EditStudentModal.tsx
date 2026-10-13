import { useId, useState, type FormEvent } from "react";
import {
  isYearLevel,
  YEAR_LEVELS,
  type YearLevel,
} from "../../data/studentOptions";
import type { Student, StudentEdits } from "../../types/types";
import { splitFullName, type NameParts } from "../../utils/splitFullName";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import { CONTROL_CLASS, Field, OptionSelect, SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

interface FormState extends NameParts {
  email: string;
  yearLevel: YearLevel;
}

function createForm(student: Student | null): FormState {
  if (student === null) {
    return {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      yearLevel: YEAR_LEVELS[0],
    };
  }
  return {
    ...splitFullName(student.fullName),
    email: student.email,
    yearLevel: student.yearLevel,
  };
}

interface EditStudentModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  student: Student | null;
  onClose: () => void;
  /** Called with the student number (the record's id) and the edited values. */
  onUpdate: (studentNumber: string, edits: StudentEdits) => void;
}

export function EditStudentModal({ isOpen, student, onClose, onUpdate }: EditStudentModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
    program: `${baseId}-program`,
    year: `${baseId}-year`,
    email: `${baseId}-email`,
  };

  const [form, setForm] = useState<FormState>(() => createForm(student));

  // The modal stays mounted so it can fade, so the form is reset during render
  // whenever it opens or the target student changes (no effect needed).
  const [previous, setPrevious] = useState({ isOpen, student });
  if (previous.isOpen !== isOpen || previous.student !== student) {
    setPrevious({ isOpen, student });
    if (isOpen) setForm(createForm(student));
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (student === null) return;

    const fullName = [form.firstName, form.middleName, form.lastName]
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .join(" ");

    onUpdate(student.studentId, {
      fullName,
      email: form.email.trim(),
      yearLevel: form.yearLevel,
    });
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 id={ids.title} className="font-headline-md text-headline-md font-bold text-on-surface">
            Edit Student
          </h3>
          {student && (
            <p className="font-body-sm text-body-sm text-outline">
              <span className="font-data-tabular">{student.studentId}</span>
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded-md text-outline hover:text-on-surface"
        >
          <Icon name="close" className="text-body-lg" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-space-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <Field htmlFor={ids.firstName} label="First Name">
            <input
              id={ids.firstName}
              type="text"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.middleName} label="Middle Name">
            <input
              id={ids.middleName}
              type="text"
              autoComplete="additional-name"
              value={form.middleName}
              onChange={(event) => update("middleName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.lastName} label="Last Name">
            <input
              id={ids.lastName}
              type="text"
              required
              autoComplete="family-name"
              value={form.lastName}
              onChange={(event) => update("lastName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-space-md">
          <Field htmlFor={ids.year} label="Year Level">
            <OptionSelect
              id={ids.year}
              value={form.yearLevel}
              options={YEAR_LEVELS}
              isOption={isYearLevel}
              onChange={(yearLevel) => update("yearLevel", yearLevel)}
            />
          </Field>
        </div>

        <Field htmlFor={ids.email} label="Email Address">
          <input
            id={ids.email}
            type="email"
            required
            value={form.email}
            onChange={(event) => update("email", event.target.value)}
            className={CONTROL_CLASS}
          />
        </Field>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON_CLASS}>
            Cancel
          </button>
          <button
            type="submit"
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}