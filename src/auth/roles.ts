export const ROLES = ["Admin", "Treasurer", "Cashier", "Student"] as const;
export type Role = (typeof ROLES)[number];

/** `userRoles` comes from the API as plain strings, so this compares by value. */
export function hasAnyRole(
  userRoles: readonly string[] | undefined,
  allowed: readonly Role[],
): boolean {
  return (
    userRoles !== undefined && allowed.some((role) => userRoles.includes(role))
  );
}
