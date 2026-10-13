import type { BadgeTone } from "../components/ui/StatusBadge";

export const PROMISSORY_STATUSES = [
  "pending",
  "approved",
  "availed",
  "cancelled",
  "rejected",
] as const;
export type PromissoryStatus = (typeof PROMISSORY_STATUSES)[number];

export type PromissoryStatusFilter = "all" | PromissoryStatus;

export interface PromissoryStatusMeta {
  label: string;
  tone: BadgeTone;
}

export const PROMISSORY_STATUS_META: Record<PromissoryStatus, PromissoryStatusMeta> = {
  pending: { label: "Pending", tone: "pending" },
  approved: { label: "Approved", tone: "success" },
  availed: { label: "Availed", tone: "outlined" },
  cancelled: { label: "Cancelled", tone: "muted" },
  rejected: { label: "Rejected", tone: "danger" },
};

export const STATUS_FILTER_OPTIONS: readonly { value: PromissoryStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...PROMISSORY_STATUSES.map((status) => ({
    value: status,
    label: PROMISSORY_STATUS_META[status].label,
  })),
];