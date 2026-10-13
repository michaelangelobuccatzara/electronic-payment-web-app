import { useCurrentTime } from "../../hooks/useCurrentTime";
import { formatDateTime } from "../../utils/formatDateTime";

export function LiveClock() {
  const now = useCurrentTime();

  return (
    <time
      dateTime={now.toISOString()}
      className="font-data-tabular text-data-tabular text-on-surface"
    >
      {formatDateTime(now)}
    </time>
  );
}