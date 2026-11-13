import type { Transaction } from "@/lib/transactions/types";

export type CategorySpend = {
  category: string;
  amountMinor: number;
};

export function categorySpending(transactions: Transaction[], yearMonth: string): CategorySpend[] {
  const totals = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense" || !transaction.transactionDate.startsWith(yearMonth)) {
      continue;
    }
    const category = transaction.category ?? "Other";
    totals.set(category, (totals.get(category) ?? 0) + transaction.amountMinor);
  }

  return [...totals.entries()]
    .map(([category, amountMinor]) => ({ category, amountMinor }))
    .sort((left, right) => right.amountMinor - left.amountMinor || left.category.localeCompare(right.category));
}

export function shareLabel(amountMinor: number, totalMinor: number) {
  if (totalMinor <= 0 || amountMinor <= 0) {
    return "0%";
  }
  const share = (amountMinor / totalMinor) * 100;
  if (share < 1) {
    return "<1%";
  }
  return `${Math.round(share)}%`;
}
