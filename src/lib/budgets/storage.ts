import type { Budget } from "@/lib/budgets/types";

const storageKey = "pockie.budgets";

function isBudget(value: unknown): value is Budget {
  if (!value || typeof value !== "object") {
    return false;
  }

  const budget = value as Budget;
  return (
    typeof budget.id === "string" &&
    typeof budget.category === "string" &&
    /^\d{4}-\d{2}$/.test(budget.yearMonth) &&
    Number.isInteger(budget.limitMinor) &&
    budget.limitMinor > 0
  );
}

export function readBudgets(): Budget[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isBudget);
  } catch {
    return [];
  }
}

export function writeBudgets(budgets: Budget[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(budgets));
}
