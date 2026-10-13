import { useId, useState, type FormEvent } from "react";
import {
  isProgram,
  isYearLevel,
  PROGRAMS,
  YEAR_LEVELS,
} from "../../data/studentOptions";
import type { Student, StudentEdits } from "../../types/types";
import { CONTROL_CLASS, Field, OptionSelect, SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

interface EditStudentFormProps {
  student: Student;
  onSave: (edits: StudentEdits) => void;
  onCancel: () => void;
}

/**
 * Mounted only while the Edit tab is showing, so its initial state is always read from the
 * current student and there is nothing to keep in sync with an effect.
 */
export function EditStudentForm({ student, onSave, onCancel }: EditStudentFormProps) {
  const baseId = useId();
  const [form, setForm] = useState<StudentEdits>(() => ({
    fullName: student.fullName,
    program: student.program,
    yearLevel: student.yearLevel,
    email: student.email,
    phone: student.phone,
  }));

  const update = <K extends keyof StudentEdits>(key: K, value: StudentEdits[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({
      ...form,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
      <Field htmlFor={`${baseId}-name`} label="Full Name">
        <input
          id={`${baseId}-name`}
          type="text"
          required
          value={form.fullName}
          onChange={(event) => update("fullName", event.target.value)}
          className={CONTROL_CLASS}
        />
      </Field>

      <div className="grid grid-cols-2 gap-space-md">
        <Field htmlFor={`${baseId}-program`} label="Program">
          <OptionSelect
            id={`${baseId}-program`}
            value={form.program}
            options={PROGRAMS}
            isOption={isProgram}
            onChange={(program) => update("program", program)}
          />
        </Field>
        <Field htmlFor={`${baseId}-year`} label="Year Level">
          <OptionSelect
            id={`${baseId}-year`}
            value={form.yearLevel}
            options={YEAR_LEVELS}
            isOption={isYearLevel}
            onChange={(yearLevel) => update("yearLevel", yearLevel)}
          />
        </Field>
      </div>

      <Field htmlFor={`${baseId}-email`} label="Email Address">
        <input
          id={`${baseId}-email`}
          type="email"
          required
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          className={CONTROL_CLASS}
        />
      </Field>

      <Field htmlFor={`${baseId}-phone`} label="Mobile Contact">
        <input
          id={`${baseId}-phone`}
          type="text"
          required
          value={form.phone}
          onChange={(event) => update("phone", event.target.value)}
          className={CONTROL_CLASS}
        />
      </Field>

      <div className="flex items-center justify-end gap-space-sm pt-space-md">
        <button type="button" onClick={onCancel} className={SECONDARY_BUTTON_CLASS}>
          Cancel
        </button>
        <button
          type="submit"
          className="px-space-lg py-space-sm bg-primary text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary-container transition-colors shadow-xs"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}