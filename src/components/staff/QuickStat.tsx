import { Icon } from "../ui/Icon";

type QuickStatTone = "neutral" | "success";

const TONE_CLASSES: Record<QuickStatTone, { iconBox: string; label: string }> = {
  neutral: {
    iconBox: "bg-surface-container text-primary",
    label: "text-on-surface-variant",
  },
  success: {
    iconBox: "bg-secondary-container text-on-secondary-container",
    label: "text-on-secondary-container",
  },
};

interface QuickStatProps {
  label: string;
  value: number;
  /** Material Symbols icon name */
  icon: string;
  tone: QuickStatTone;
}

export function QuickStat({ label, value, icon, tone }: QuickStatProps) {
  const { iconBox, label: labelClass } = TONE_CLASSES[tone];

  return (
    <div className="bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-xs flex items-center gap-space-md">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBox}`}>
        <Icon name={icon} className="text-headline-md" />
      </div>
      <div className="flex flex-col">
        <span className={`font-label-sm text-label-sm uppercase ${labelClass}`}>{label}</span>
        <span className="font-headline-md text-headline-md text-on-surface font-bold leading-tight">
          {value.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}