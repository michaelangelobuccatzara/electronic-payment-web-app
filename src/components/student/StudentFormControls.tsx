import type { ReactNode } from "react";

export const CONTROL_CLASS =
  "px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm text-body-sm focus:outline-hidden focus:bg-surface-container";

export const SECONDARY_BUTTON_CLASS =
  "px-space-md py-space-sm bg-surface-container text-on-surface font-title-sm text-body-sm font-medium rounded-lg hover:bg-surface-container-high transition-colors";

interface FieldProps {
  htmlFor: string;
  label: string;
  children: ReactNode;
}

export function Field({ htmlFor, label, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="font-label-sm text-label-sm uppercase font-semibold text-outline"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

interface OptionSelectProps<T extends string> {
  id: string;
  value: T;
  options: readonly T[];
  /** Narrows the DOM's plain-string value back to T. */
  isOption: (value: string) => value is T;
  onChange: (value: T) => void;
}

export function OptionSelect<T extends string>({
  id,
  value,
  options,
  isOption,
  onChange,
}: OptionSelectProps<T>) {
  return (
    <select
      id={id}
      value={value}
      onChange={(event) => {
        const next = event.target.value;
        if (isOption(next)) onChange(next);
      }}
      className={CONTROL_CLASS}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}