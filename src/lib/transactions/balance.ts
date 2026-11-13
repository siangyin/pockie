import type { Account } from "@/lib/accounts/types";
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

  return 0;
}

export function accountBalanceMinor(account: Account, transactions: Transaction[]): number {
  return transactions.reduce(
    (balance, transaction) => balance + movementMinor(account, transaction),
    account.openingBalanceMinor,
  );
}

export function monthTotals(transactions: Transaction[], yearMonth: string) {
  let incomeMinor = 0;
  let expenseMinor = 0;

  for (const transaction of transactions) {
    if (!transaction.transactionDate.startsWith(yearMonth)) {
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

export function sortTransactions(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((left, right) => {
    if (left.transactionDate !== right.transactionDate) {
      return right.transactionDate.localeCompare(left.transactionDate);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });
}
