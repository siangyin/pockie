import { isTransactionType, type AdjustmentDirection, type Transaction } from "@/lib/transactions/types";

const storageKey = "pockie.transactions";

function isTransaction(value: unknown): value is Transaction {
  if (!value || typeof value !== "object") {
    return false;
  }

  const transaction = value as Transaction;
  return (
    typeof transaction.id === "string" &&
    isTransactionType(transaction.type) &&
    typeof transaction.accountId === "string" &&
    (transaction.counterAccountId === null || typeof transaction.counterAccountId === "string") &&
    (transaction.category === null || typeof transaction.category === "string") &&
    Number.isInteger(transaction.amountMinor) &&
    transaction.amountMinor > 0 &&
    transaction.currency === "SGD" &&
    typeof transaction.transactionDate === "string" &&
    (transaction.direction === undefined ||
      transaction.direction === null ||
      transaction.direction === "up" ||
      transaction.direction === "down") &&
    (transaction.type !== "adjustment" ||
      transaction.direction === "up" ||
      transaction.direction === "down")
  );
}

function directionOf(transaction: Transaction): AdjustmentDirection | null {
  if (transaction.type !== "adjustment") {
    return null;
  }
  return transaction.direction === "down" ? "down" : "up";
}

export function readTransactions(): Transaction[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTransaction).map((transaction) => ({
      ...transaction,
      merchant: transaction.merchant ?? "",
      notes: transaction.notes ?? "",
      direction: directionOf(transaction),
      recurringId: typeof transaction.recurringId === "string" ? transaction.recurringId : null,
      occurrenceDate: typeof transaction.occurrenceDate === "string" ? transaction.occurrenceDate : null,
    }));
  } catch {
    return [];
  }
}

export function writeTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(transactions));
}
