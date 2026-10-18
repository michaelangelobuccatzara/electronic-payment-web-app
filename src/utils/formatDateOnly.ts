const formatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

/** "2026-10-16" -> "Oct 16, 2026". Built from the parts, so the day never shifts with the time zone. */
export function formatDateOnly(value: string): string {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  return formatter.format(new Date(year, month - 1, day));
}