import { useId, useState, type FormEvent } from "react";
import {
  isYearLevel,
  YEAR_LEVELS,
  type YearLevel,
} from "../../data/studentOptions";
import type { NewStudentDraft } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import {
  CONTROL_CLASS,
  Field,
  OptionSelect,
  SECONDARY_BUTTON_CLASS,
} from "./StudentFormControls";

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  yearLevel: YearLevel;
}

function createInitialForm(): FormState {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    yearLevel: YEAR_LEVELS[0],
  };
}

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (draft: NewStudentDraft) => void;
}

export function AddStudentModal({
  isOpen,
  onClose,
  onAdd,
}: AddStudentModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
    year: `${baseId}-year`,
    email: `${baseId}-email`,
  };

  const [form, setForm] = useState<FormState>(createInitialForm);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const reset = () => setForm(createInitialForm());

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fullName = [form.firstName, form.middleName, form.lastName]
      .map((part) => part.trim())
      .filter((part) => part !== "")
      .join(" ");

    onAdd({
      fullName,
      email: form.email.trim(),
      yearLevel: form.yearLevel,
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
          <h3
            id={ids.title}
            className="font-headline-md text-headline-md font-bold text-on-surface"
          >
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

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-space-md mt-space-xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <Field htmlFor={ids.firstName} label="First Name">
            <input
              id={ids.firstName}
              type="text"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => update("firstName", event.target.value)}
              placeholder="Juan"
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
              placeholder="Santos"
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
              placeholder="Dela Cruz"
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
            placeholder="student@univ.edu"
            className={CONTROL_CLASS}
          />
        </Field>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={handleClose}
            className={SECONDARY_BUTTON_CLASS}
          >
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
