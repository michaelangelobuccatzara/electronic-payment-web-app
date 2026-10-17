import { Icon } from "./Icon";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-space-sm rounded-lg bg-error-container p-space-sm font-body-sm text-body-sm text-on-error-container"
    >
      <span className="flex items-center gap-2">
        <Icon name="error" className="text-body-md" />
        {message}
      </span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-semibold underline">
          Retry
        </button>
      )}
    </div>
  );
}