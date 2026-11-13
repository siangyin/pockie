import type { Account } from "@/lib/accounts/types";
import { monthBounds } from "@/lib/dates/month";
import type { Transaction } from "@/lib/transactions/types";

export function movementMinor(account: Account, transaction: Transaction): number {
  const amount = transaction.amountMinor;
  const card = account.accountType === "credit_card";

  if (transaction.type === "income" && transaction.accountId === account.id) {
    return card ? -amount : amount;
  }

  if (transaction.type === "expense" && transaction.accountId === account.id) {
    return card ? amount : -amount;
  }

  if (transaction.type === "transfer" && transaction.accountId === account.id) {
    return card ? amount : -amount;
  }

  if (transaction.type === "transfer" && transaction.counterAccountId === account.id) {
    return card ? -amount : amount;
  }

  if (transaction.type === "adjustment" && transaction.accountId === account.id) {
    return transaction.direction === "down" ? -amount : amount;
  }

  return 0;
}

export function accountBalanceAsOf(account: Account, transactions: Transaction[], asOf: string): number {
  const opening = account.openingBalanceDate <= asOf ? account.openingBalanceMinor : 0;
  return transactions.reduce((balance, transaction) => {
    if (transaction.transactionDate > asOf) {
      return balance;
    }
    return balance + movementMinor(account, transaction);
  }, opening);
}

export function accountBalanceMinor(account: Account, transactions: Transaction[]): number {
  return transactions.reduce(
    (balance, transaction) => balance + movementMinor(account, transaction),
    account.openingBalanceMinor,
  );
}

export function rangeTotals(transactions: Transaction[], start: string, end: string) {
  let incomeMinor = 0;
  let expenseMinor = 0;

  for (const transaction of transactions) {
    if (transaction.transactionDate < start || transaction.transactionDate > end) {
      continue;
    }
    if (transaction.type === "income") {
      incomeMinor += transaction.amountMinor;
    }
    if (transaction.type === "expense") {
      expenseMinor += transaction.amountMinor;
    }
  }

  return {
    incomeMinor,
    expenseMinor,
    remainingMinor: incomeMinor - expenseMinor,
  };
}

export function monthTotals(transactions: Transaction[], yearMonth: string) {
  const bounds = monthBounds(yearMonth);
  return rangeTotals(transactions, bounds.start, bounds.end);
}

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    if (left.transactionDate !== right.transactionDate) {
      return right.transactionDate.localeCompare(left.transactionDate);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });
}
