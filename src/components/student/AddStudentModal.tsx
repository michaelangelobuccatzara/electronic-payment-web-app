import { useId, useState, type FormEvent } from "react";
import {
  isProgram,
  isYearLevel,
  PROGRAMS,
  YEAR_LEVELS,
} from "../../data/studentOptions";
import type { NewStudentDraft } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import { CONTROL_CLASS, Field, OptionSelect, SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

function createInitialForm(): NewStudentDraft {
  return {
    studentNumber: "",
    fullName: "",
    email: "",
    program: PROGRAMS[0],
    yearLevel: YEAR_LEVELS[0],
  };
}

interface AddStudentModalProps {
  isOpen: boolean;
  isStudentNumberTaken: (studentNumber: string) => boolean;
  onClose: () => void;
  onAdd: (draft: NewStudentDraft) => void;
}

export function AddStudentModal({
  isOpen,
  isStudentNumberTaken,
  onClose,
  onAdd,
}: AddStudentModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    number: `${baseId}-number`,
    numberError: `${baseId}-number-error`,
    name: `${baseId}-name`,
    program: `${baseId}-program`,
    year: `${baseId}-year`,
    email: `${baseId}-email`,
  };

  const [form, setForm] = useState<NewStudentDraft>(createInitialForm);
  const [numberError, setNumberError] = useState<string | null>(null);

  const update = <K extends keyof NewStudentDraft>(key: K, value: NewStudentDraft[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const reset = () => {
    setForm(createInitialForm());
    setNumberError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const studentNumber = form.studentNumber.trim();

    if (isStudentNumberTaken(studentNumber)) {
      setNumberError("A student with this number already exists.");
      return;
    }

    onAdd({
      ...form,
      studentNumber,
      fullName: form.fullName.trim(),
      email: form.email.trim(),
    });
    reset();
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={handleClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 id={ids.title} className="font-headline-md text-headline-md font-bold text-on-surface">
            Enroll New Student
          </h3>
          <p className="font-body-sm text-body-sm text-outline">
            Assign institutional ID, course, and initial bursar assessment.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="p-1 rounded-md text-outline hover:text-on-surface"
        >
          <Icon name="close" className="text-body-lg" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-md mt-space-xs">
        <div className="grid grid-cols-2 gap-space-md">
          <Field htmlFor={ids.number} label="Student Number">
            <input
              id={ids.number}
              type="text"
              required
              value={form.studentNumber}
              onChange={(event) => {
                update("studentNumber", event.target.value);
                setNumberError(null);
              }}
              placeholder="2024-XXXXX"
              aria-invalid={numberError !== null}
              aria-describedby={numberError ? ids.numberError : undefined}
              className={`${CONTROL_CLASS} font-data-tabular`}
            />
            {numberError && (
              <p id={ids.numberError} role="alert" className="font-body-sm text-body-sm text-error">
                {numberError}
              </p>
            )}
          </Field>
          <Field htmlFor={ids.name} label="Full Name">
            <input
              id={ids.name}
              type="text"
              required
              value={form.fullName}
              onChange={(event) => update("fullName", event.target.value)}
              placeholder="Juan Dela Cruz"
              className={CONTROL_CLASS}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-space-md">
          <Field htmlFor={ids.program} label="Program">
            <OptionSelect
              id={ids.program}
              value={form.program}
              options={PROGRAMS}
              isOption={isProgram}
              onChange={(program) => update("program", program)}
            />
          </Field>
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
            placeholder="student@univ.edu"
            className={CONTROL_CLASS}
          />
        </Field>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button type="button" onClick={handleClose} className={SECONDARY_BUTTON_CLASS}>
            Cancel
          </button>
          <button
            type="submit"
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Add Student
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}