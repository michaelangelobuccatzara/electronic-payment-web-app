export type BadgeTone = "success" | "pending";

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

interface StatusBadgeProps {
  tone: BadgeTone;
  label: string;
}

export function StatusBadge({ tone, label }: StatusBadgeProps) {
  const { container, dot } = TONE_STYLES[tone];

  return (
    <span
      className={`inline-flex items-center gap-1 px-space-sm py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${container}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}