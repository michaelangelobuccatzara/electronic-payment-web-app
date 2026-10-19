import { useId, useState, type FormEvent } from "react";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { Field, SECONDARY_BUTTON_CLASS } from "../student/StudentFormControls";

const OVERLAY_CLASS = "backdrop-blur-xs p-4 duration-200";
const BOX_CLASS = "rounded-xl shadow-xl overflow-hidden duration-200";

const INPUT_CLASS =
  "w-full px-3 py-2 rounded-lg bg-surface-container-low text-on-surface text-body-sm focus:outline-hidden focus:bg-surface-container";

const PRIMARY_BUTTON_CLASS =
  "px-space-lg py-space-sm bg-primary text-on-primary font-title-sm text-body-sm font-medium rounded-lg hover:bg-primary-container transition-colors shadow-xs inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60";

interface DateRange {
  dateFrom: string;
  dateTo: string;
}

const EMPTY_RANGE: DateRange = { dateFrom: "", dateTo: "" };

interface ExportPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Dates are "YYYY-MM-DD". Rejects on failure; the modal shows the error and stays open. */
  onExport: (dateFrom: string, dateTo: string) => Promise<void>;
}

export function ExportPaymentsModal({ isOpen, onClose, onExport }: ExportPaymentsModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    dateFrom: `${baseId}-date-from`,
    dateTo: `${baseId}-date-to`,
  };

  const [range, setRange] = useState<DateRange>(EMPTY_RANGE);
  const { run: exportCsv, isPending, error, reset: resetError } = useAsyncAction(onExport);

  // The modal stays mounted so it can fade. Each time it opens, start clean. No effect needed.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setRange(EMPTY_RANGE);
      resetError();
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    // ISO dates compare correctly as plain strings. The min/max attributes normally prevent this.
    if (range.dateFrom === "" || range.dateTo === "" || range.dateFrom > range.dateTo) return;

    // On success the page closes the modal. On failure the error shows here and the dates stay.
    await exportCsv(range.dateFrom, range.dateTo);
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={onClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-md"
      overlayClassName={OVERLAY_CLASS}
      boxClassName={BOX_CLASS}
    >
      <div className="p-space-lg border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <Icon name="file_download" className="text-body-lg text-primary" />
          <h3 id={ids.title} className="font-title-sm text-title-sm font-bold text-on-surface">
            Export Payments
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
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Choose the date range of the payments to include in the CSV file.
          </p>

          <div className="grid grid-cols-2 gap-space-sm">
            <Field htmlFor={ids.dateFrom} label="Date From">
              <input
                id={ids.dateFrom}
                type="date"
                required
                max={range.dateTo || undefined}
                value={range.dateFrom}
                onChange={(event) =>
                  setRange((previous) => ({ ...previous, dateFrom: event.target.value }))
                }
                className={INPUT_CLASS}
              />
            </Field>

            <Field htmlFor={ids.dateTo} label="Date To">
              <input
                id={ids.dateTo}
                type="date"
                required
                min={range.dateFrom || undefined}
                value={range.dateTo}
                onChange={(event) =>
                  setRange((previous) => ({ ...previous, dateTo: event.target.value }))
                }
                className={INPUT_CLASS}
              />
            </Field>
          </div>
        </fieldset>

        {error !== null && (
          <div className="px-space-lg pb-space-md">
            <ErrorAlert message={error} />
          </div>
        )}

        <div className="p-space-md bg-surface-container-low flex items-center justify-end gap-space-sm">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON_CLASS}>
            Cancel
          </button>
          <button type="submit" disabled={isPending} className={PRIMARY_BUTTON_CLASS}>
            <Icon name="download" className="text-body-md" />
            {isPending ? "Exporting…" : "Download CSV"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}