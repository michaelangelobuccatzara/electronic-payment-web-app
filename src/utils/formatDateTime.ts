const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Date -> "Oct 24, 2024 • 09:41 AM" (in the viewer's local time zone). */
export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return `${dateFormatter.format(date)} • ${timeFormatter.format(date)}`;
}