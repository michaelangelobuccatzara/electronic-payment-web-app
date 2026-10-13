export type BadgeTone = "success" | "pending" | "neutral" | "danger" | "outlined" | "muted";
type BadgeSize = "sm" | "md";

const TONE_STYLES: Record<BadgeTone, { container: string; dot: string }> = {
  success: {
    container: "bg-secondary-container text-on-secondary-container font-semibold",
    dot: "bg-primary",
  },
  pending: {
    container: "bg-tertiary-fixed text-on-tertiary-fixed-variant font-semibold",
    dot: "bg-tertiary",
  },
  neutral: {
    container: "bg-surface-container-high text-on-surface font-medium",
    dot: "bg-secondary",
  },
  danger: {
    container: "bg-error-container text-on-error-container font-semibold",
    dot: "bg-error",
  },
  // A ring (not a border) so the badge keeps the same size as the others.
  outlined: {
    container:
      "bg-surface-container-lowest text-primary-container ring-1 ring-inset ring-primary-container font-semibold",
    dot: "bg-primary-container",
  },
  muted: {
    container: "bg-surface-container-high text-on-surface-variant font-semibold",
    dot: "bg-outline",
  },
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "gap-1 px-space-sm py-0.5",
  md: "gap-1.5 px-2.5 py-1", // used by the staff and promissory tables
};

interface StatusBadgeProps {
  tone: BadgeTone;
  label: string;
  size?: BadgeSize;
  showDot?: boolean;
}

export function StatusBadge({
  tone,
  label,
  size = "sm",
  showDot = true,
}: StatusBadgeProps) {
  const { container, dot } = TONE_STYLES[tone];

  return (
    <span
      className={`inline-flex items-center rounded-full font-label-sm text-label-sm ${SIZE_CLASSES[size]} ${container}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />}
      {label}
    </span>
  );
}