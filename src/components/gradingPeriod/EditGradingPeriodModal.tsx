import { useId, useState, type FormEvent } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { GradingPeriodRecord, UpdateGradingPeriod } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { Field } from "../student/StudentFormControls";
import {
  CANCEL_BUTTON_CLASS,
  MODAL_BOX_CLASS,
  MODAL_OVERLAY_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "./periodStyles";

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-hidden";

// The sequence is kept as a string while typing and converted to a number on submit.
interface FormState {
  name: string;
  chargeDueDate: string;
  sequence: string;
}

function createForm(period: GradingPeriodRecord | null): FormState {
  return {
    name: period?.name ?? "",
    chargeDueDate: period?.chargeDueDate ?? "",
    sequence: period === null ? "" : String(period.sequence),
  };
}

interface EditGradingPeriodModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  period: GradingPeriodRecord | null;
  onClose: () => void;
  /** Called with the id of the period being edited and the new values. Rejects on failure. */
  onUpdate: (periodId: string, update: UpdateGradingPeriod) => Promise<void>;
}

export function EditGradingPeriodModal({
  isOpen,
  period,
  onClose,
  onUpdate,
}: EditGradingPeriodModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    name: `${baseId}-name`,
    chargeDueDate: `${baseId}-charge-due-date`,
    sequence: `${baseId}-sequence`,
    sequenceHint: `${baseId}-sequence-hint`,
  };

  const [form, setForm] = useState<FormState>(() => createForm(period));
  const { run: save, isPending, error, reset: resetError } = useAsyncAction(onUpdate);

  // The modal stays mounted so it can fade. Re-seed the form whenever it opens or the target
  // period changes, and clear any old error. No effect needed.
  const [previous, setPrevious] = useState({ isOpen, period });
  if (previous.isOpen !== isOpen || previous.period !== period) {
    setPrevious({ isOpen, period });
    if (isOpen) {
      setForm(createForm(period));
      resetError();
    }
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (period === null || isPending) return;

    const sequence = Number.parseInt(form.sequence, 10);
    if (!Number.isSafeInteger(sequence) || sequence < 1) return; // the pattern below normally prevents this

    // On success the page closes the modal. On failure the error shows here and the form is kept.
    await save(period.id, {
      name: form.name.trim(),
      chargeDueDate: form.chargeDueDate,
      sequence,
    });
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-md"
      overlayClassName={MODAL_OVERLAY_CLASS}
      boxClassName={MODAL_BOX_CLASS}
    >
      <div className="p-space-lg border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="edit" className="text-body-lg text-primary" />
          <h3 id={ids.title} className="font-title-sm text-title-sm font-bold text-on-surface">
            Edit Grading Period
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-outline hover:text-on-surface transition-colors"
        >
          <Icon name="close" className="text-body-lg" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col">
        <fieldset disabled={isPending} className="flex min-w-0 flex-col gap-space-md p-space-lg">
          <Field htmlFor={ids.name} label="Period / Milestone Title">
            <input
              id={ids.name}
              type="text"
              required
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>

          <div className="grid grid-cols-2 gap-space-sm">
            <Field htmlFor={ids.chargeDueDate} label="Charge Due Date">
              <input
                id={ids.chargeDueDate}
                type="date"
                required
                value={form.chargeDueDate}
                onChange={(event) => update("chargeDueDate", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field htmlFor={ids.sequence} label="Sequence">
              <input
                id={ids.sequence}
                type="text"
                inputMode="numeric"
                required
                pattern="[1-9][0-9]*"
                title="Enter a whole number, 1 or higher"
                aria-describedby={ids.sequenceHint}
                value={form.sequence}
                // Digits only, even when pasted.
                onChange={(event) => update("sequence", event.target.value.replace(/\D/g, ""))}
                className={INPUT_CLASS}
              />
              <span id={ids.sequenceHint} className="font-body-sm text-body-sm text-outline">
                Order within the semester (1 = first).
              </span>
            </Field>
          </div>
        </fieldset>

        {error !== null && (
          <div className="px-space-lg pb-space-md">
            <ErrorAlert message={error} />
          </div>
        )}

        <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
          <button type="button" onClick={onClose} className={CANCEL_BUTTON_CLASS}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className={`${PRIMARY_BUTTON_CLASS} disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}