import type { BadgeTone } from "../components/ui/StatusBadge";

export const PROMISSORY_STATUSES = [
  "Pending",
  "Approved",
  "Availed",
  "Cancelled",
  "Rejected",
] as const;
export type PromissoryStatus = (typeof PROMISSORY_STATUSES)[number];

export type PromissoryStatusFilter = "all" | PromissoryStatus;

export interface PromissoryStatusMeta {
  label: string;
  tone: BadgeTone;
}

export const PROMISSORY_STATUS_META: Record<PromissoryStatus, PromissoryStatusMeta> = {
  Pending: { label: "Pending", tone: "pending" },
  Approved: { label: "Approved", tone: "success" },
  Availed: { label: "Availed", tone: "outlined" },
  Cancelled: { label: "Cancelled", tone: "muted" },
  Rejected: { label: "Rejected", tone: "danger" },
};

export const STATUS_FILTER_OPTIONS: readonly { value: PromissoryStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...PROMISSORY_STATUSES.map((status) => ({
    value: status,
    label: PROMISSORY_STATUS_META[status].label,
  })),
];

export function isPromissoryStatus(value: string): value is PromissoryStatus {
  return PROMISSORY_STATUSES.some((status) => status === value);
}

/** Safe for API data: an unknown status shows as a neutral badge instead of crashing the table. */
export function getPromissoryStatusMeta(status: string): PromissoryStatusMeta {
  return isPromissoryStatus(status)
    ? PROMISSORY_STATUS_META[status]
    : { label: status, tone: "neutral" };
}