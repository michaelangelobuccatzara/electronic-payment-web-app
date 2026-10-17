import { useId, useState, type FormEvent, type ReactNode } from "react";
import { STAFF_ROLE_OPTIONS, isStaffRole } from "../../data/staffOptions";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { AddStaff, NewStaffDraft, StaffRole } from "../../types/types";
import { Icon } from "../ui/Icon";
import { useAsyncAction } from "../../hooks/useAsyncAction";

const EDITABLE_INPUT =
  "h-10 bg-surface-container-lowest text-on-surface border border-outline-variant font-body-md text-body-md rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs";

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  role: StaffRole | "";
  password: string;
}

function createInitialForm(): FormState {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "",
    password: "",
  };
}

interface FormFieldProps {
  htmlFor: string;
  label: string;
  required?: boolean;
  /** Rendered with id `${htmlFor}-hint` so the input can reference it via aria-describedby. */
  hint?: string;
  children: ReactNode;
}

function FormField({
  htmlFor,
  label,
  required = false,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="font-label-sm text-label-sm font-semibold text-on-surface uppercase"
      >
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      {children}
      {hint && (
        <span
          id={`${htmlFor}-hint`}
          className="font-body-sm text-body-sm text-outline"
        >
          {hint}
        </span>
      )}
    </div>
  );
}

interface AddStaffDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (draft: AddStaff) => Promise<void>; // was: => void
}

export function AddStaffDrawer({
  isOpen,
  onClose,
  onSave,
}: AddStaffDrawerProps) {
  const baseId = useId();
  const ids = {
    form: `${baseId}-form`,
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
    nameHint: `${baseId}-name-hint`,
    email: `${baseId}-email`,
    role: `${baseId}-role`,
    password: `${baseId}-password`,
  };

  const [form, setForm] = useState<FormState>(createInitialForm);
  const [showPassword, setShowPassword] = useState(false);

  useEscapeKey(isOpen, onClose);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  // inside the component, after the useState calls:
  const {
    run: save,
    isPending,
    error,
    reset: resetError,
  } = useAsyncAction(onSave);

  const handleClose = () => {
    resetError();
    onClose();
  };
  useEscapeKey(isOpen, handleClose); // use handleClose here, on the backdrop onClick, and on the X button

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.role === "") return;

    const saved = await save({
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      role: form.role,
      password: form.password,
    });

    // Keep what the user typed if saving failed, so they can fix it and retry.
    if (saved) {
      setForm(createInitialForm());
      setShowPassword(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs z-50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={ids.title}
        inert={!isOpen}
        className={`fixed right-0 top-0 h-full w-full max-w-lg bg-surface-container-lowest shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-space-lg bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <Icon name="person_add" className="text-body-lg" />
            </div>
            <div className="flex flex-col">
              <h2
                id={ids.title}
                className="font-title-sm text-title-sm font-bold text-on-surface"
              >
                Add New Staff Member
              </h2>
              <span className="font-label-sm text-label-sm text-outline">
                Authorize institution personnel & assign role access
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <Icon name="close" />
          </button>
        </div>

        <form
          id={ids.form}
          onSubmit={handleSubmit}
          className="p-space-lg flex-1 overflow-y-auto flex flex-col gap-space-md"
        >
          <div className="flex flex-col gap-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
              <FormField htmlFor={ids.firstName} label="First Name" required>
                <input
                  id={ids.firstName}
                  type="text"
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={(event) =>
                    updateField("firstName", event.target.value)
                  }
                  placeholder="e.g. Maria"
                  aria-describedby={ids.nameHint}
                  className={`${EDITABLE_INPUT} px-3`}
                />
              </FormField>

              <FormField htmlFor={ids.middleName} label="Middle Name">
                <input
                  id={ids.middleName}
                  type="text"
                  autoComplete="additional-name"
                  value={form.middleName}
                  onChange={(event) =>
                    updateField("middleName", event.target.value)
                  }
                  placeholder="e.g. Teresa"
                  aria-describedby={ids.nameHint}
                  className={`${EDITABLE_INPUT} px-3`}
                />
              </FormField>

              <FormField htmlFor={ids.lastName} label="Last Name" required>
                <input
                  id={ids.lastName}
                  type="text"
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={(event) =>
                    updateField("lastName", event.target.value)
                  }
                  placeholder="e.g. Mendoza"
                  aria-describedby={ids.nameHint}
                  className={`${EDITABLE_INPUT} px-3`}
                />
              </FormField>
            </div>
            <span
              id={ids.nameHint}
              className="font-body-sm text-body-sm text-outline"
            >
              Include honorifics or post-nominals if applicable
            </span>
          </div>

          <FormField htmlFor={ids.role} label="Operational Role" required>
            <div className="relative">
              <select
                id={ids.role}
                required
                value={form.role}
                onChange={(event) => {
                  const value = event.target.value;
                  if (isStaffRole(value)) updateField("role", value);
                }}
                className={`${EDITABLE_INPUT} w-full pl-3 pr-8 appearance-none cursor-pointer`}
              >
                <option value="" disabled>
                  Select administrative clearance...
                </option>
                {STAFF_ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon
                name="expand_more"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline text-body-md pointer-events-none"
              />
            </div>
          </FormField>

          <FormField htmlFor={ids.password} label="Password" required>
            <div className="relative">
              <input
                id={ids.password}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
                aria-describedby={`${ids.password}-hint`}
                className={`${EDITABLE_INPUT} w-full pl-3 pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <Icon
                  name={showPassword ? "visibility_off" : "visibility"}
                  className="text-body-md"
                />
              </button>
            </div>
          </FormField>

          {error !== null && (
            <div
              role="alert"
              className="rounded-lg bg-error-container p-space-sm font-body-sm text-body-sm text-on-error-container"
            >
              {error}
            </div>
          )}
        </form>

        <div className="p-space-md bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-space-sm">
          <button
            type="submit"
            form={ids.form}
            disabled={isPending}
            className="h-10 px-5 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Icon name="check" className="text-body-md" />
            <span>{isPending ? "Saving…" : "Save Staff Account"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
