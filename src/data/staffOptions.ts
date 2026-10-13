import type { StaffPermissionId, StaffRole } from "../types/types";

export interface StaffRoleOption {
  value: StaffRole;
  label: string;
}

export const STAFF_ROLE_OPTIONS: readonly StaffRoleOption[] = [
  { value: "Cashier", label: "Cashier (Payment Collection & Receipt Issuance)" },
  { value: "Treasurer", label: "Treasurer (Financial Records & Account Reconciliation)" },
];

/** Narrows a raw <select> value, which the DOM types as plain string. */
export function isStaffRole(value: string): value is StaffRole {
  return STAFF_ROLE_OPTIONS.some((option) => option.value === value);
}

export interface StaffPermissionOption {
  id: StaffPermissionId;
  label: string;
  defaultChecked: boolean;
}

export const STAFF_PERMISSION_OPTIONS: readonly StaffPermissionOption[] = [
  { id: "view-balances", label: "Access Student Account Balances", defaultChecked: true },
  { id: "issue-receipts", label: "Issue Electronic Official Receipts", defaultChecked: true },
  { id: "approve-promissory", label: "Approve Promissory Notes (Dean Authorization)", defaultChecked: false },
];