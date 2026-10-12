const pesoFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatCurrency(amount: number): string {
  return pesoFormatter.format(amount);
}