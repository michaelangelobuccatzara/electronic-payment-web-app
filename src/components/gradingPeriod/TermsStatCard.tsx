import { Icon } from "../ui/Icon";

interface TermsStatCardProps {
  label: string;
  value: number;
  badge: string;
}

export function TermsStatCard({ label, value, badge }: TermsStatCardProps) {
  return (
    <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="font-label-sm text-label-sm uppercase text-outline font-semibold">{label}</span>
        <Icon name="date_range" className="text-body-md text-secondary" />
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="font-headline-lg text-headline-lg font-bold text-on-surface">{value}</span>
        <span className="font-label-sm text-label-sm text-on-secondary-container bg-secondary-container px-1.5 py-0.5 rounded-xs font-medium">
          {badge}
        </span>
      </div>
    </div>
  );
}