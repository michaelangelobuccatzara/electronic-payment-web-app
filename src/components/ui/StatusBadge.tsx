export type BadgeTone = "success" | "pending";
type BadgeSize = "sm" | "md";

const TONE_STYLES: Record<BadgeTone, { container: string; dot: string }> = {
  success: {
    container: "bg-secondary-container text-on-secondary-container",
    dot: "bg-primary",
  },
  pending: {
    container: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
    dot: "bg-tertiary",
  },
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "gap-1 px-space-sm py-0.5",
  md: "gap-1.5 px-2.5 py-1", // used by the staff table
};

interface StatusBadgeProps {
  tone: BadgeTone;
  label: string;
  size?: BadgeSize;
}

export function StatusBadge({ tone, label, size = "sm" }: StatusBadgeProps) {
  const { container, dot } = TONE_STYLES[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full font-label-sm text-label-sm font-semibold ${SIZE_CLASSES[size]} ${container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}