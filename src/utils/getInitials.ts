/** "Dr. Roberto Gonzales" -> "RG". Words ending in "." are treated as titles and skipped. */
export function getInitials(fullName: string): string {
  const words = fullName
    .split(/\s+/)
    .filter((word) => word !== "" && !word.endsWith("."));
  const [first = "", ...rest] = words;
  const last = rest.at(-1) ?? "";
  return (first.charAt(0) + last.charAt(0)).toUpperCase();
}