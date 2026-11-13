import type { Budget } from "@/lib/budgets/types";
import type { Transaction } from "@/lib/transactions/types";

export function spentMinor(transactions: Transaction[], yearMonth: string, category: string) {
  let spent = 0;

  for (const transaction of transactions) {
    if (transaction.type !== "expense") {
      continue;
    }
    if (transaction.category !== category) {
      continue;
    }
    if (!transaction.transactionDate.startsWith(yearMonth)) {
      continue;
    }
    spent += transaction.amountMinor;
  }

  return spent;
}

export function monthBudgetSummary(budgets: Budget[], transactions: Transaction[], yearMonth: string) {
  const monthBudgets = budgets.filter((budget) => budget.yearMonth === yearMonth);
  let limitMinor = 0;
  let spent = 0;
  const overCategories: string[] = [];

  for (const budget of monthBudgets) {
    const categorySpent = spentMinor(transactions, yearMonth, budget.category);
    limitMinor += budget.limitMinor;
    spent += categorySpent;
    if (categorySpent > budget.limitMinor) {
      overCategories.push(budget.category);
    }
  }

  return {
    count: monthBudgets.length,
    limitMinor,
    spentMinor: spent,
    remainingMinor: limitMinor - spent,
    overCategories,
  };
}
