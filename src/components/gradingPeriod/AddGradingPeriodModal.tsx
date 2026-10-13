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

function createInitialForm(defaultAcademicYear: string): NewGradingPeriodDraft {
  return {
    academicYear: defaultAcademicYear,
    title: "",
    startDate: "",
    endDate: "",
    activateImmediately: false,
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
  defaultAcademicYear,
  onClose,
  onSave,
}: AddGradingPeriodModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    year: `${baseId}-year`,
    name: `${baseId}-name`,
    start: `${baseId}-start`,
    end: `${baseId}-end`,
    activate: `${baseId}-activate`,
  };

  const [form, setForm] = useState<NewGradingPeriodDraft>(() =>
    createInitialForm(defaultAcademicYear),
  );

  const update = <K extends keyof NewGradingPeriodDraft>(
    key: K,
    value: NewGradingPeriodDraft[K],
  ) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleClose = () => {
    setForm(createInitialForm(defaultAcademicYear));
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ ...form, academicYear: form.academicYear.trim(), title: form.title.trim() });
    setForm(createInitialForm(defaultAcademicYear));
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
          <Field htmlFor={ids.year} label="Academic Year">
            <input
              id={ids.year}
              type="text"
              required
              value={form.academicYear}
              onChange={(event) => update("academicYear", event.target.value)}
              className={INPUT_CLASS}
            />
          </Field>

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
            <Field htmlFor={ids.start} label="Start Date">
              <input
                id={ids.start}
                type="date"
                required
                value={form.startDate}
                onChange={(event) => update("startDate", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
            <Field htmlFor={ids.end} label="End Date">
              <input
                id={ids.end}
                type="date"
                required
                min={form.startDate || undefined}
                value={form.endDate}
                onChange={(event) => update("endDate", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>
          </div>

          <div className="flex items-center gap-space-sm p-3 rounded-lg bg-surface-container-low">
            <input
              id={ids.activate}
              type="checkbox"
              checked={form.activateImmediately}
              onChange={(event) => update("activateImmediately", event.target.checked)}
              className="rounded-xs w-4 h-4 accent-primary"
            />
            <label
              htmlFor={ids.activate}
              className="font-body-sm text-body-sm text-on-surface font-medium cursor-pointer"
            >
              Activate immediately as Current Period
            </label>
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