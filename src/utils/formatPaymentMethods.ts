/** ["Cash", "Credit"] -> "Cash, Credit". An empty list shows a dash instead of a blank cell. */
export function formatPaymentMethods(methods: readonly string[]): string {
  return methods.length > 0 ? methods.join(", ") : "—";
}