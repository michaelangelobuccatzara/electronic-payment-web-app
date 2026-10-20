import { useId, useState, type FormEvent } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { StaffMember, UpdateStaff } from "../../types/types";
import { CONTROL_CLASS, Field, SECONDARY_BUTTON_CLASS } from "../student/StudentFormControls";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";

interface EditStaffModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  member: StaffMember | null;
  onClose: () => void;
  /** Rejects on failure; the modal shows the error and stays open. */
  onUpdate: (id: string, updateStaff: UpdateStaff) => Promise<void>;
}

export function EditStaffModal({ isOpen, member, onClose, onUpdate }: EditStaffModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
  };

  const [staff, setStaff] = useState<UpdateStaff>({ firstName: "", middleName: "", lastName: "" });
  const { run: update, isPending, error, reset: resetError } = useAsyncAction(onUpdate);

  // The modal stays mounted so it can fade, so the fields are reset during render whenever it
  // opens or the target member changes (no effect needed). A stale error is cleared too.
  const [previous, setPrevious] = useState({ isOpen, member });
  if (previous.isOpen !== isOpen || previous.member !== member) {
    setPrevious({ isOpen, member });
    if (isOpen && member) {
      setStaff({
        firstName: member.firstName ?? "",
        middleName: member.middleName ?? "",
        lastName: member.lastName ?? "",
      });
      resetError();
    }
  }

  const updateField = <K extends keyof UpdateStaff>(key: K, value: UpdateStaff[K]) => {
    setStaff((current) => ({ ...current, [key]: value }));
  };

  // Used for Escape, the X and Cancel. Closing mid-request would hide a possible error.
  const handleClose = () => {
    if (isPending) return;
    resetError();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (member === null || isPending) return;

    // On success the page closes the modal. On failure the error shows here and the form is kept.
    await update(member.id, {
      firstName: staff.firstName,
      middleName: staff.middleName,
      lastName: staff.lastName,
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
            Edit Staff Member
          </h3>
          {member && (
            <p className="font-body-sm text-body-sm text-outline">
              <span className="font-data-tabular">{member.schoolId}</span>
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
        <fieldset disabled={isPending} className="min-w-0 grid grid-cols-1 sm:grid-cols-3 gap-space-md">
          <Field htmlFor={ids.firstName} label="First Name">
            <input
              id={ids.firstName}
              type="text"
              required
              autoComplete="given-name"
              value={staff.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.middleName} label="Middle Name">
            <input
              id={ids.middleName}
              type="text"
              autoComplete="additional-name"
              value={staff.middleName}
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
              value={staff.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
        </fieldset>

        {error !== null && <ErrorAlert message={error} />}

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className={`${SECONDARY_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Updating…" : "Update"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}