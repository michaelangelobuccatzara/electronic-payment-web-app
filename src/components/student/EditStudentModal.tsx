import { useId, useState, type FormEvent } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { StudentRecord, UpdateStudent } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { CONTROL_CLASS, Field, SECONDARY_BUTTON_CLASS } from "./StudentFormControls";

function createForm(student: StudentRecord | null): UpdateStudent {
  return {
    firstName: student?.firstName ?? "",
    middleName: student?.middleName ?? "",
    lastName: student?.lastName ?? "",
  };
}

interface EditStudentModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  student: StudentRecord | null;
  onClose: () => void;
  /** Called with the id of the student being edited, plus the new name parts. Rejects on failure. */
  onUpdate: (id: string, update: UpdateStudent) => Promise<void>;
}

export function EditStudentModal({ isOpen, student, onClose, onUpdate }: EditStudentModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
  };

  const [form, setForm] = useState<UpdateStudent>(() => createForm(student));
  const { run: save, isPending, error, reset: resetError } = useAsyncAction(onUpdate);

  // The modal stays mounted so it can fade, so the form is re-seeded during render whenever
  // it opens or the target student changes. No effect needed.
  const [previous, setPrevious] = useState({ isOpen, student });
  if (previous.isOpen !== isOpen || previous.student !== student) {
    setPrevious({ isOpen, student });
    if (isOpen) setForm(createForm(student));
  }

  const updateField = <K extends keyof UpdateStudent>(key: K, value: UpdateStudent[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleClose = () => {
    resetError();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (student === null || isPending) return;

    // On success the page closes the modal. On failure the error shows here and the form is kept.
    await save(student.id, {
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
    });
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
            Edit Student
          </h3>
          {student && (
            <p className="font-body-sm text-body-sm text-outline">
              <span className="font-data-tabular">{student.schoolId}</span>
            </p>
          )}
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
        <fieldset disabled={isPending} className="grid min-w-0 grid-cols-1 gap-space-md sm:grid-cols-3">
          <Field htmlFor={ids.firstName} label="First Name">
            <input
              id={ids.firstName}
              type="text"
              required
              autoComplete="given-name"
              value={form.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.middleName} label="Middle Name">
            <input
              id={ids.middleName}
              type="text"
              autoComplete="additional-name"
              value={form.middleName}
              onChange={(event) => updateField("middleName", event.target.value)}
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
              onChange={(event) => updateField("lastName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
        </fieldset>

        {error !== null && <ErrorAlert message={error} />}

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button type="button" onClick={handleClose} className={SECONDARY_BUTTON_CLASS}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}