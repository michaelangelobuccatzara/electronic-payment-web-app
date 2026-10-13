import type { BadgeTone } from "../components/ui/StatusBadge";

export const PAYMENT_METHODS = ["cash", "credit", "cash-credit"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Cash",
  credit: "Credit",
  "cash-credit": "Cash, Credit",
};

export type PaymentMethodFilter = "all" | PaymentMethod;

/** Narrows a raw <select> value, which the DOM types as plain string. */
export function isPaymentMethodFilter(value: string): value is PaymentMethodFilter {
  return value === "all" || PAYMENT_METHODS.some((method) => method === value);
}

export type PaymentTransactionStatus = "successful" | "pending" | "failed";

interface PaymentStatusMeta {
  /** Plain label, used for screen-reader text in the table. */
  label: string;
  /** Wording shown on the receipt badge. */
  receiptLabel: string;
  tone: BadgeTone;
  /** Dot color in the table's Method column. */
  dotClassName: string;
}

export const PAYMENT_STATUS_META: Record<PaymentTransactionStatus, PaymentStatusMeta> = {
  successful: {
    label: "Successful",
    receiptLabel: "Settled & Verified",
    tone: "success",
    dotClassName: "bg-primary",
  },
  pending: {
    label: "Pending",
    receiptLabel: "Pending Gateway Clearance",
    tone: "pending",
    dotClassName: "bg-tertiary-fixed-dim",
  },
  failed: {
    label: "Failed",
    receiptLabel: "Failed / Voided",
    tone: "danger",
    dotClassName: "bg-error",
  },
};