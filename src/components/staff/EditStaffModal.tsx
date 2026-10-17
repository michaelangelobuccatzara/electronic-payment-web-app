import { useEffect, useId, useState, type FormEvent } from "react";
import type { StaffMember, UpdateStaff } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
import {
  CONTROL_CLASS,
  Field,
  SECONDARY_BUTTON_CLASS,
} from "../student/StudentFormControls";

interface EditStaffModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  member: StaffMember | null;
  onClose: () => void;
  /** Called with the id of the staff member being edited, plus the new name parts. */
  onUpdate: (id: string, updateStaff: UpdateStaff) => void;
}

export function EditStaffModal({
  isOpen,
  member,
  onClose,
  onUpdate,
}: EditStaffModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
  };

  const [staff, setStaff] = useState<UpdateStaff>({
    firstName: "",
    middleName: "",
    lastName: "",
  });

  // The modal stays mounted so it can fade, so the fields are reset during render
  // whenever it opens or the target member changes (no effect needed).
  const [previous, setPrevious] = useState({ isOpen, member });
  if (previous.isOpen !== isOpen || previous.member !== member) {
    setPrevious({ isOpen, member });
  }

  const updateField = <K extends keyof UpdateStaff>(
    key: K,
    value: UpdateStaff[K],
  ) => {
    setStaff((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (member === null) return;

    onUpdate(member.id, {
      firstName: staff?.firstName!,
      middleName: staff?.middleName!,
      lastName: staff?.lastName!,
    });
  };

  useEffect(() => {
    if (!isOpen || !member) return;

    setStaff({
      firstName: member.firstName ?? "",
      middleName: member.middleName ?? "",
      lastName: member.lastName ?? "",
    });
  }, [isOpen, member]);

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3
            id={ids.title}
            className="font-headline-md text-headline-md font-bold text-on-surface"
          >
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
          onClick={onClose}
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
              value={staff?.firstName}
              onChange={(event) => updateField("firstName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.middleName} label="Middle Name">
            <input
              id={ids.middleName}
              type="text"
              autoComplete="additional-name"
              value={staff?.middleName}
              onChange={(event) =>
                updateField("middleName", event.target.value)
              }
              className={CONTROL_CLASS}
            />
          </Field>
          <Field htmlFor={ids.lastName} label="Last Name">
            <input
              id={ids.lastName}
              type="text"
              required
              autoComplete="family-name"
              value={staff?.lastName}
              onChange={(event) => updateField("lastName", event.target.value)}
              className={CONTROL_CLASS}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button
            type="button"
            onClick={onClose}
            className={SECONDARY_BUTTON_CLASS}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-title-sm text-body-sm font-semibold rounded-lg hover:bg-primary transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}
