import type { Account } from "@/lib/accounts/types";
import type { Budget } from "@/lib/budgets/types";
import { toCsv } from "@/lib/csv";
import { minorToInput } from "@/lib/money/sgd";
import type { Transaction } from "@/lib/transactions/types";

function accountName(accounts: Account[], id: string | null) {
  if (!id) {
    return "";
  }
  return accounts.find((account) => account.id === id)?.name ?? "";
}

export function transactionsCsv(transactions: Transaction[], accounts: Account[]) {
  const ordered = [...transactions].sort(
    (left, right) =>
      left.transactionDate.localeCompare(right.transactionDate) ||
      left.createdAt.localeCompare(right.createdAt),
  );
  const rows = [
    ["date", "type", "amount", "category", "account", "to_account", "merchant", "notes"],
    ...ordered.map((transaction) => [
      transaction.transactionDate,
      transaction.type,
      minorToInput(transaction.amountMinor),
      transaction.category ?? "",
      accountName(accounts, transaction.accountId),
      accountName(accounts, transaction.counterAccountId),
      transaction.merchant,
      transaction.notes,
    ]),
  ];
  return toCsv(rows);
}

export function budgetsCsv(budgets: Budget[]) {
  const ordered = [...budgets].sort(
    (left, right) =>
      left.yearMonth.localeCompare(right.yearMonth) || left.category.localeCompare(right.category),
  );
  const rows = [
    ["month", "category", "limit"],
    ...ordered.map((budget) => [budget.yearMonth, budget.category, minorToInput(budget.limitMinor)]),
  ];
  return toCsv(rows);
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
