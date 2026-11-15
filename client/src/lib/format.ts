export function formatAmount(amount: string | number): string {
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function sumAmounts(amounts: (string | number)[]): number {
  const cents = amounts.reduce<number>(
    (sum, a) => sum + Math.round(Number(a) * 100),
    0
  );
  return cents / 100;
}