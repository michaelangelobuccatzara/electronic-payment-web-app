import { useId, useState, type FormEvent } from "react";
import type { GradingPeriod, NewGradingPeriodDraft } from "../../types/types";
import { getPeriodName, toDateInputValue } from "../../utils/gradingPeriod";
import { AnimatedModal } from "../ui/AnimatedModal";
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

function createForm(period: GradingPeriod | null): NewGradingPeriodDraft {
  if (period === null) return { title: "", chargeDueDate: "" };
  return {
    title: getPeriodName(period),
    chargeDueDate: toDateInputValue(period.dueDate),
  };
}

interface EditGradingPeriodModalProps {
  isOpen: boolean;
  /** Keep it set while the modal fades out, so the fields don't blank mid-animation. */
  period: GradingPeriod | null;
  onClose: () => void;
  /** Called with the id of the period being edited, plus the edited values. */
  onUpdate: (periodId: string, edits: NewGradingPeriodDraft) => void;
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
  };

  const [form, setForm] = useState<NewGradingPeriodDraft>(() => createForm(period));

  // The modal stays mounted so it can fade, so the form is reset during render
  // whenever it opens or the target period changes (no effect needed).
  const [previous, setPrevious] = useState({ isOpen, period });
  if (previous.isOpen !== isOpen || previous.period !== period) {
    setPrevious({ isOpen, period });
    if (isOpen) setForm(createForm(period));
  }

  const update = <K extends keyof NewGradingPeriodDraft>(
    key: K,
    value: NewGradingPeriodDraft[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (period === null) return;
    onUpdate(period.id, { ...form, title: form.title.trim() });
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
        <div className="p-space-lg flex flex-col gap-space-md">
          <Field htmlFor={ids.name} label="Period / Milestone Title">
            <input
              id={ids.name}
              type="text"
              required
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Summer Term - Final Exams"
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
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
          <button type="button" onClick={onClose} className={CANCEL_BUTTON_CLASS}>
            Cancel
          </button>
          <button type="submit" className={PRIMARY_BUTTON_CLASS}>
            Update Period
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}