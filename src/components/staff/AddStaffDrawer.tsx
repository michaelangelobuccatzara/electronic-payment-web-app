import { useId, useState, type FormEvent, type ReactNode } from "react";
import {
  STAFF_PERMISSION_OPTIONS,
  STAFF_ROLE_OPTIONS,
  isStaffRole,
} from "../../data/staffOptions";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import type { NewStaffDraft, StaffPermissionId, StaffRole } from "../../types/types";
import { Icon } from "../ui/Icon";

const EDITABLE_INPUT =
  "h-10 bg-surface-container-lowest text-on-surface border border-outline-variant font-body-md text-body-md rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs";
const READ_ONLY_INPUT =
  "h-10 px-3 bg-surface-container-low text-on-surface-variant rounded-lg cursor-not-allowed focus:outline-hidden";

interface FormState {
  fullName: string;
  email: string;
  role: StaffRole | "";
  temporaryPassword: string;
  permissions: StaffPermissionId[];
}

function createInitialForm(): FormState {
  return {
    fullName: "",
    email: "",
    role: "",
    temporaryPassword: "",
    permissions: STAFF_PERMISSION_OPTIONS.filter((o) => o.defaultChecked).map((o) => o.id),
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

function FormField({ htmlFor, label, required = false, hint, children }: FormFieldProps) {
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
        <span id={`${htmlFor}-hint`} className="font-body-sm text-body-sm text-outline">
          {hint}
        </span>
      )}
    </div>
  );
}

interface AddStaffDrawerProps {
  isOpen: boolean;
  nextStaffId: string;
  campusBranch: string;
  onClose: () => void;
  onSave: (draft: NewStaffDraft) => void;
}

export function AddStaffDrawer({
  isOpen,
  nextStaffId,
  campusBranch,
  onClose,
  onSave,
}: AddStaffDrawerProps) {
  const baseId = useId();
  const ids = {
    form: `${baseId}-form`,
    title: `${baseId}-title`,
    permissions: `${baseId}-permissions`,
    staffId: `${baseId}-staff-id`,
    campus: `${baseId}-campus`,
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    role: `${baseId}-role`,
    password: `${baseId}-password`,
  };

  const [form, setForm] = useState<FormState>(createInitialForm);
  const [showPassword, setShowPassword] = useState(false);

  useEscapeKey(isOpen, onClose);

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const togglePermission = (id: StaffPermissionId) => {
    setForm((previous) => ({
      ...previous,
      permissions: previous.permissions.includes(id)
        ? previous.permissions.filter((permission) => permission !== id)
        : [...previous.permissions, id],
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.role === "") return; // The select is `required`; this also narrows the type.

    onSave({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role,
      temporaryPassword: form.temporaryPassword,
      permissions: form.permissions,
    });
    setForm(createInitialForm());
    setShowPassword(false);
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
              <h2 id={ids.title} className="font-title-sm text-title-sm font-bold text-on-surface">
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
          <div className="grid grid-cols-2 gap-space-md">
            <FormField htmlFor={ids.staffId} label="Staff ID" required hint="Auto-sequenced institutional ID">
              <input
                id={ids.staffId}
                readOnly
                value={nextStaffId}
                aria-describedby={`${ids.staffId}-hint`}
                className={`${READ_ONLY_INPUT} font-data-tabular text-data-tabular`}
              />
            </FormField>
            <FormField htmlFor={ids.campus} label="Campus Branch">
              <input
                id={ids.campus}
                readOnly
                value={campusBranch}
                className={`${READ_ONLY_INPUT} font-body-sm text-body-sm`}
              />
            </FormField>
          </div>

          <FormField
            htmlFor={ids.name}
            label="Full Name"
            required
            hint="Include honorifics or post-nominals if applicable"
          >
            <input
              id={ids.name}
              type="text"
              required
              value={form.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              placeholder="e.g. Maria Teresa Mendoza"
              aria-describedby={`${ids.name}-hint`}
              className={`${EDITABLE_INPUT} px-3`}
            />
          </FormField>

          <FormField
            htmlFor={ids.email}
            label="Institutional Email"
            required
            hint="Must end in institutional domain @ndtc.edu.ph"
          >
            <div className="relative">
              <Icon
                name="mail"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-body-md pointer-events-none"
              />
              <input
                id={ids.email}
                type="email"
                required
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="username@ndtc.edu.ph"
                aria-describedby={`${ids.email}-hint`}
                className={`${EDITABLE_INPUT} w-full pl-9 pr-3`}
              />
            </div>
          </FormField>

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

          <FormField
            htmlFor={ids.password}
            label="Temporary Password"
            required
            hint="The user will be prompted to reset upon initial authentication."
          >
            <div className="relative">
              <input
                id={ids.password}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={form.temporaryPassword}
                onChange={(event) => updateField("temporaryPassword", event.target.value)}
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
                <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-body-md" />
              </button>
            </div>
          </FormField>

          <div
            role="group"
            aria-labelledby={ids.permissions}
            className="bg-surface-container-low p-space-sm rounded-lg flex flex-col gap-2 mt-2"
          >
            <span
              id={ids.permissions}
              className="font-label-sm text-label-sm uppercase font-semibold text-on-surface"
            >
              Permissions Assigned
            </span>
            {STAFF_PERMISSION_OPTIONS.map((option) => (
              <label key={option.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(option.id)}
                  onChange={() => togglePermission(option.id)}
                  className="w-4 h-4 rounded-xs accent-primary"
                />
                <span className="font-body-sm text-body-sm text-on-surface">{option.label}</span>
              </label>
            ))}
          </div>
        </form>

        <div className="p-space-md bg-surface-container-low border-t border-outline-variant flex items-center justify-end gap-space-sm">
          <button
            type="submit"
            form={ids.form}
            className="h-10 px-5 bg-primary text-on-primary hover:bg-primary-container font-label-md text-label-md font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Icon name="check" className="text-body-md" />
            <span>Save Staff Account</span>
          </button>
        </div>
      </div>
    </>
  );
}