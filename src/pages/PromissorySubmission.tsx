import { useId, useState, type FormEvent } from "react";
import { promissoryService } from "../components/promissory/promissoryService";
import { ErrorAlert } from "../components/ui/ErrorAlert";
import { Icon } from "../components/ui/Icon";
import { useAsyncAction } from "../hooks/useAsyncAction";

// Module-level, so its identity is stable.
const submitNote = (note: string) => promissoryService.submit({ note });

export function PromissorySubmission() {
  const baseId = useId();
  const noteId = `${baseId}-note`;
  const hintId = `${baseId}-hint`;

  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { run: submit, isPending, error, reset } = useAsyncAction(submitNote);

  const trimmedNote = note.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending || trimmedNote === "") return;

    // On failure the error shows and the text is kept, so nothing the student typed is lost.
    const succeeded = await submit(trimmedNote);
    if (succeeded) {
      setNote("");
      setIsSubmitted(true);
    }
  };

  const handleSubmitAnother = () => {
    reset();
    setIsSubmitted(false);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg max-w-2xl">
      <div className="flex flex-col">
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
          Submit Promissory Note
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
          Request more time to settle your balance. A staff member will review your request.
        </p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-xs p-space-lg">
        {isSubmitted ? (
          <div role="status" className="flex flex-col items-start gap-space-md">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <Icon name="task_alt" className="text-headline-md" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-title-sm text-title-sm font-bold text-on-surface">
                  Request submitted
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Your promissory note was sent for review.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSubmitAnother}
              className="px-space-md py-space-sm bg-surface-container text-on-surface font-title-sm text-body-sm font-medium rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-space-md">
            <fieldset disabled={isPending} className="min-w-0 flex flex-col gap-1">
              <label
                htmlFor={noteId}
                className="font-label-sm text-label-sm uppercase font-semibold text-outline"
              >
                Your Note
              </label>
              <textarea
                id={noteId}
                required
                rows={6}
                aria-describedby={hintId}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Explain why you need a promissory note…"
                className="w-full p-space-sm bg-surface-container-low focus:bg-surface-container-lowest text-on-surface text-body-md rounded-lg transition-all resize-y focus:outline-hidden focus:ring-2 focus:ring-primary-container"
              />
              <span id={hintId} className="font-body-sm text-body-sm text-outline">
                The treasurer will read this when reviewing your request.
              </span>
            </fieldset>

            {error !== null && <ErrorAlert message={error} />}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending || trimmedNote === ""}
                className="px-space-xl py-2.5 rounded-xs text-label-md font-semibold bg-primary text-on-primary hover:bg-primary-container transition-colors shadow-xs flex items-center justify-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon name="send" className="text-body-md" />
                {isPending ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}