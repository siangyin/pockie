import { isTransactionType, type Transaction } from "@/lib/transactions/types";

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
    typeof transaction.transactionDate === "string"
  );
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

    return parsed.filter(isTransaction);
  } catch {
    return [];
  }
}

export function writeTransactions(transactions: Transaction[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(transactions));
}
