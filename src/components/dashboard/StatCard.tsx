import type { ReactNode } from "react";

type ValueTone = "default" | "primary" | "tertiary";

const VALUE_TONE_CLASSES: Record<ValueTone, string> = {
  default: "text-on-surface",
  primary: "text-primary",
  tertiary: "text-tertiary",
};

interface StatCardProps {
  label: string;
  value: string;
  caption: string;
  /** Icon or badge shown at the top-right of the card. */
  accessory: ReactNode;
  valueTone?: ValueTone;
}

export function StatCard({
  label,
  value,
  caption,
  accessory,
  valueTone = "default",
}: StatCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-space-sm">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {label}
        </span>
        {accessory}
      </div>
      <div>
        <div
          className={`font-headline-lg text-headline-lg font-semibold tracking-tight ${VALUE_TONE_CLASSES[valueTone]}`}
        >
          {value}
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          {caption}
        </p>
      </div>
    </div>
  );
}