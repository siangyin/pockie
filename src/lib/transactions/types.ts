export const transactionTypes = ["income", "expense", "transfer", "adjustment"] as const;

export type TransactionType = (typeof transactionTypes)[number];

export type AdjustmentDirection = "up" | "down";

export type Transaction = {
  id: string;
  type: TransactionType;
  accountId: string;
  counterAccountId: string | null;
  category: string | null;
  amountMinor: number;
  currency: "SGD";
  transactionDate: string;
  merchant: string;
  notes: string;
  direction: AdjustmentDirection | null;
  recurringId: string | null;
  occurrenceDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export function isTransactionType(value: string): value is TransactionType {
  return transactionTypes.some((type) => type === value);
}
