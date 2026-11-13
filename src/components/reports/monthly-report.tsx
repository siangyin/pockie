"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { spentMinor } from "@/lib/budgets/progress";
import { formatYearMonth, shiftYearMonth, singaporeYearMonth } from "@/lib/dates/month";
import { formatMinorAsSgd } from "@/lib/money/sgd";
import { categorySpending, shareLabel } from "@/lib/reports/summary";
import { monthTotals } from "@/lib/transactions/balance";

const linkClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function MonthlyReport() {
  const [yearMonth, setYearMonth] = useState<string | null>(null);

  useEffect(() => {
    setYearMonth(singaporeYearMonth());
  }, []);

  if (!yearMonth) {
    return <p className="text-sm text-muted-foreground">Loading report…</p>;
  }

  return (
    <div>
      <Link href="/" className={linkClassName}>
        Home
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Spending</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Income, spending and where the money went. Transfers are left out.
        </p>
      </header>
      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" className={linkClassName} onClick={() => setYearMonth(shiftYearMonth(yearMonth, -1))}>
          Previous
        </button>
        <p className="font-bold">{formatYearMonth(yearMonth)}</p>
        <button type="button" className={linkClassName} onClick={() => setYearMonth(shiftYearMonth(yearMonth, 1))}>
          Next
        </button>
      </div>
      <ReportMonth yearMonth={yearMonth} />
    </div>
  );
}

function ReportMonth({ yearMonth }: { yearMonth: string }) {
  const { transactions, ready } = useTransactions();
  const { budgets } = useBudgets();

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading report…</p>;
  }

  const totals = monthTotals(transactions, yearMonth);
  const categories = categorySpending(transactions, yearMonth);
  const monthBudgets = budgets.filter((budget) => budget.yearMonth === yearMonth);
  const larger = Math.max(totals.incomeMinor, totals.expenseMinor, 1);
  const kept = totals.remainingMinor;
  const months = Array.from({ length: 6 }, (_, index) => shiftYearMonth(yearMonth, index - 5));
  const trend = months.map((month) => ({
    yearMonth: month,
    expenseMinor: monthTotals(transactions, month).expenseMinor,
  }));
  const trendMax = Math.max(...trend.map((month) => month.expenseMinor), 1);

  let comparison = "No income or spending in this month.";
  if (kept > 0) {
    comparison = `You kept ${formatMinorAsSgd(kept)} after spending.`;
  } else if (kept < 0) {
    comparison = `You spent ${formatMinorAsSgd(Math.abs(kept))} more than you earned.`;
  } else if (totals.incomeMinor > 0 || totals.expenseMinor > 0) {
    comparison = "Income and spending match.";
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
        <h2 className="font-semibold">Income and spending</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">{comparison}</p>
        <AmountBar label="Income" amountMinor={totals.incomeMinor} width={(totals.incomeMinor / larger) * 100} />
        <AmountBar label="Spending" amountMinor={totals.expenseMinor} width={(totals.expenseMinor / larger) * 100} />
      </section>

      <section>
        <h2 className="font-semibold">By category</h2>
        {categories.length === 0 ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">No spending in this month.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {categories.map((category) => (
              <li key={category.category} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-bold">{category.category}</p>
                  <p className="text-right font-extrabold">{formatMinorAsSgd(category.amountMinor)}</p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {shareLabel(category.amountMinor, totals.expenseMinor)} of spending
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-amber-soft" aria-hidden="true">
                  <div
                    className="h-full bg-ink"
                    style={{
                      width: `${Math.min(100, Math.max((category.amountMinor / totals.expenseMinor) * 100, 2))}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {monthBudgets.length > 0 ? (
        <section>
          <h2 className="font-semibold">Against your budgets</h2>
          <ul className="mt-3 grid gap-3">
            {monthBudgets.map((budget) => {
              const spent = spentMinor(transactions, yearMonth, budget.category);
              const remaining = budget.limitMinor - spent;
              return (
                <li key={budget.id} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
                  <p className="font-bold">{budget.category}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {remaining < 0
                      ? `Over by ${formatMinorAsSgd(Math.abs(remaining))}`
                      : `${formatMinorAsSgd(remaining)} left of ${formatMinorAsSgd(budget.limitMinor)}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="font-semibold">Recent months</h2>
        <ul className="mt-3 grid gap-3">
          {trend.map((month) => (
            <li key={month.yearMonth} className="rounded-2xl bg-card px-4 py-3 ring-1 ring-border">
              <div className="flex items-center justify-between gap-3">
                <p className={month.yearMonth === yearMonth ? "font-bold" : "text-sm font-semibold"}>
                  {formatYearMonth(month.yearMonth)}
                </p>
                <p className="font-extrabold">{formatMinorAsSgd(month.expenseMinor)}</p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-soft" aria-hidden="true">
                <div
                  className="h-full bg-ink"
                  style={{
                    width: `${month.expenseMinor === 0 ? 0 : Math.min(100, Math.max((month.expenseMinor / trendMax) * 100, 2))}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function AmountBar({ label, amountMinor, width }: { label: string; amountMinor: number; width: number }) {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="font-extrabold">{formatMinorAsSgd(amountMinor)}</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-soft" aria-hidden="true">
        <div className="h-full bg-ink" style={{ width: `${Math.min(100, Math.max(width, amountMinor > 0 ? 2 : 0))}%` }} />
      </div>
    </div>
  );
}
