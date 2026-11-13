"use client";

import { useEffect, useState } from "react";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { Button } from "@/components/ui/button";
import { expenseCategories, isExpenseCategory } from "@/lib/categories";
import { formatYearMonth, shiftYearMonth, singaporeYearMonth } from "@/lib/dates/month";
import { spentMinor } from "@/lib/budgets/progress";
import { formatMinorAsSgd, minorToInput, parseSgdToMinor } from "@/lib/money/sgd";
import { useTransactions } from "@/components/transactions/transactions-provider";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function BudgetBoard() {
  const [yearMonth, setYearMonth] = useState<string | null>(null);

  useEffect(() => {
    setYearMonth(singaporeYearMonth());
  }, []);

  if (!yearMonth) {
    return <p className="text-sm text-muted-foreground">Loading budgets…</p>;
  }

  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Budgets</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Set a limit for the month, then see what&apos;s left in each category.
        </p>
      </header>
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          onClick={() => setYearMonth(shiftYearMonth(yearMonth, -1))}
        >
          Previous
        </button>
        <p className="font-bold">{formatYearMonth(yearMonth)}</p>
        <button
          type="button"
          className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          onClick={() => setYearMonth(shiftYearMonth(yearMonth, 1))}
        >
          Next
        </button>
      </div>
      <BudgetMonth key={yearMonth} yearMonth={yearMonth} />
    </div>
  );
}

function BudgetMonth({ yearMonth }: { yearMonth: string }) {
  const { budgets, ready, notice, saveBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const monthBudgets = budgets.filter((budget) => budget.yearMonth === yearMonth);
  const existing = monthBudgets.find((budget) => budget.category === category);

  function handleCategory(nextCategory: string) {
    setCategory(nextCategory);
    setError("");
    const match = monthBudgets.find((budget) => budget.category === nextCategory);
    setAmount(match ? minorToInput(match.limitMinor) : "");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minor = parseSgdToMinor(amount);
    if (!isExpenseCategory(category)) {
      setError("Choose a category.");
      return;
    }
    if (minor === null || minor <= 0) {
      setError("Enter a limit above 0, such as 50.00.");
      return;
    }
    saveBudget(category, yearMonth, minor);
    setError("");
  }

  return (
    <div>
      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor="budget-category" className="grid gap-1.5 text-sm font-semibold">
          Category
          <select
            id="budget-category"
            value={category}
            onChange={(event) => handleCategory(event.target.value)}
            className={fieldClassName}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {expenseCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label htmlFor="budget-amount" className="grid gap-1.5 text-sm font-semibold">
          Monthly limit
          <input
            id="budget-amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <p className="text-sm leading-6 text-muted-foreground">
          Choosing a category you already budgeted fills in its limit so you can change it.
        </p>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full text-base" disabled={!ready}>
          {existing ? "Update budget" : "Save budget"}
        </Button>
      </form>

      {ready && monthBudgets.length === 0 ? (
        <p className="mt-6 text-sm leading-6 text-muted-foreground">No budgets for this month.</p>
      ) : null}

      {monthBudgets.length > 0 ? (
        <ul className="mt-6 grid gap-3">
          {monthBudgets.map((budget) => {
            const spent = spentMinor(transactions, yearMonth, budget.category);
            const remaining = budget.limitMinor - spent;
            const over = remaining < 0;
            const used = Math.min(100, Math.round((spent / budget.limitMinor) * 100));

            return (
              <li key={budget.id} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{budget.category}</p>
                  <p className="text-right text-sm font-semibold">
                    {over ? "Over budget" : "On track"}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Spent {formatMinorAsSgd(spent)} of {formatMinorAsSgd(budget.limitMinor)}
                </p>
                <p className="mt-1 font-extrabold">
                  {over
                    ? `Over by ${formatMinorAsSgd(Math.abs(remaining))}`
                    : `${formatMinorAsSgd(remaining)} left`}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-soft" aria-hidden="true">
                  <div className="h-full bg-ink" style={{ width: `${used}%` }} />
                </div>
                <button
                  type="button"
                  className="mt-3 text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                  onClick={() => deleteBudget(budget.id)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
