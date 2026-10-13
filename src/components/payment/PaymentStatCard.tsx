import { Icon } from "../ui/Icon";

type StatVariant = "primary" | "neutral";

const VARIANT_CLASSES: Record<
  StatVariant,
  { accent: string; value: string; icon: string }
> = {
  primary: {
    accent: "bg-primary",
    value: "font-headline-xl text-headline-xl text-primary",
    icon: "text-primary",
  },
  neutral: {
    accent: "bg-surface-tint",
    value: "font-headline-lg text-headline-lg text-on-surface",
    icon: "text-on-surface-variant",
  },
};

interface PaymentStatCardProps {
  label: string;
  value: string;
  /** Material Symbols icon name */
  icon: string;
  variant: StatVariant;
}

export function PaymentStatCard({ label, value, icon, variant }: PaymentStatCardProps) {
  const styles = VARIANT_CLASSES[variant];

  return (
    <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-xs relative overflow-hidden flex flex-col justify-between">
      <div aria-hidden="true" className={`absolute top-0 left-0 right-0 h-1 ${styles.accent}`} />
      <div className="flex items-start justify-between">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            {label}
          </span>
          <div className={`${styles.value} font-bold mt-1 tracking-tight`}>{value}</div>
        </div>
        <Icon
          name={icon}
          className={`p-2 rounded-lg bg-surface-container-low text-headline-md ${styles.icon}`}
        />
      </div>
    </div>
  );
}