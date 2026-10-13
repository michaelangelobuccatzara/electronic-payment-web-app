import { useId, useState, type FormEvent } from "react";
import type { NewGradingPeriodDraft } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { Icon } from "../ui/Icon";
// Field lives with the Students screen for now; see the cleanup note about moving it to ui/.
import { Field } from "../student/StudentFormControls";
import {
  CANCEL_BUTTON_CLASS,
  MODAL_BOX_CLASS,
  MODAL_OVERLAY_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "./periodStyles";

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-hidden";

function createInitialForm(): NewGradingPeriodDraft {
  return {
    title: "",
    chargeDueDate: "",
  };
}

interface AddGradingPeriodModalProps {
  isOpen: boolean;
  defaultAcademicYear: string;
  onClose: () => void;
  onSave: (draft: NewGradingPeriodDraft) => void;
}

export function AddGradingPeriodModal({
  isOpen,
  onClose,
  onSave,
}: AddGradingPeriodModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    year: `${baseId}-year`,
    name: `${baseId}-name`,
    chargeDueDate: `${baseId}-start`,
  };

  const [form, setForm] = useState<NewGradingPeriodDraft>(() =>
    createInitialForm(),
  );

  const update = <K extends keyof NewGradingPeriodDraft>(
    key: K,
    value: NewGradingPeriodDraft[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleClose = () => {
    setForm(createInitialForm());
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ ...form, title: form.title.trim() });
    setForm(createInitialForm());
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={handleClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-md"
      overlayClassName={MODAL_OVERLAY_CLASS}
      boxClassName={MODAL_BOX_CLASS}
    >
      <div className="p-space-lg border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="add_circle" className="text-body-lg text-primary" />
          <h3 id={ids.title} className="font-title-sm text-title-sm font-bold text-on-surface">
            New Grading Period
          </h3>
        </div>
        <button
          type="button"
          onClick={handleClose}
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
          <button type="button" onClick={handleClose} className={CANCEL_BUTTON_CLASS}>
            Cancel
          </button>
          <button type="submit" className={PRIMARY_BUTTON_CLASS}>
            Save Period
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}