"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { useRecurring } from "@/components/recurring/recurring-provider";
import { CurrentMonth } from "@/components/layout/current-month";
import { EmptyState } from "@/components/layout/empty-state";
import { TransactionRows } from "@/components/transactions/transaction-rows";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { monthBudgetSummary } from "@/lib/budgets/progress";
import { formatDisplayDate } from "@/lib/dates/iso";
import { singaporeDate, singaporeYearMonth } from "@/lib/dates/month";
import { upcomingSchedules } from "@/lib/recurring/schedule";
import { monthTotals } from "@/lib/transactions/balance";
import { formatMinorAsSgd } from "@/lib/money/sgd";

export function HomeDashboard() {
  const { transactions, ready, notice } = useTransactions();
  const { budgets, ready: budgetsReady } = useBudgets();
  const { schedules, ready: recurringReady } = useRecurring();
  const [monthKey, setMonthKey] = useState<string | null>(null);
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    const date = singaporeDate();
    setToday(date);
    setMonthKey(date.slice(0, 7));
  }, []);

  const totals = monthKey ? monthTotals(transactions, monthKey) : null;
  const showTotals = ready && totals;
  const budgetSummary =
    monthKey && budgetsReady ? monthBudgetSummary(budgets, transactions, monthKey) : null;
  const upcoming = today && recurringReady ? upcomingSchedules(schedules, today) : [];

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pockie</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track simply. Spend wisely. Save happily.
          </p>
        </div>
        <CurrentMonth />
      </header>

      {notice ? (
        <p className="rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      {upcoming.length > 0 ? (
        <p className="rounded-2xl bg-amber-soft px-4 py-3 text-sm leading-6">
          {upcoming.length === 1
            ? `${upcoming[0].schedule.category} is due on ${formatDisplayDate(upcoming[0].nextDate)}.`
            : `${upcoming.length} payments are due within 7 days.`}{" "}
          <Link
            href="/settings/recurring"
            className="font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            View schedules
          </Link>
        </p>
      ) : null}

      <section className="rounded-3xl bg-ink px-5 py-6 text-white">
        <h2 className="text-sm font-semibold">Money remaining</h2>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">
          {showTotals ? formatMinorAsSgd(totals.remainingMinor) : "—"}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/90">Income minus spending this month.</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="text-sm font-semibold text-muted-foreground">Monthly spending</h2>
          <p className="mt-2 text-2xl font-extrabold">
            {showTotals ? formatMinorAsSgd(totals.expenseMinor) : "—"}
          </p>
        </article>
        <article className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="text-sm font-semibold text-muted-foreground">Monthly income</h2>
          <p className="mt-2 text-2xl font-extrabold">
            {showTotals ? formatMinorAsSgd(totals.incomeMinor) : "—"}
          </p>
        </article>
      </div>

      <Link
        href="/reports"
        className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        See spending
      </Link>

      <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
        <h2 className="font-semibold">Budget</h2>
        {budgetSummary && budgetSummary.count > 0 ? (
          <>
            <p className="mt-2 text-2xl font-extrabold">
              {budgetSummary.remainingMinor < 0
                ? `Over by ${formatMinorAsSgd(Math.abs(budgetSummary.remainingMinor))}`
                : `${formatMinorAsSgd(budgetSummary.remainingMinor)} left`}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Spent {formatMinorAsSgd(budgetSummary.spentMinor)} of{" "}
              {formatMinorAsSgd(budgetSummary.limitMinor)} this month.
            </p>
            {budgetSummary.overCategories.length === 1 ? (
              <p className="mt-1 text-sm font-semibold">
                {budgetSummary.overCategories[0]} is over budget.
              </p>
            ) : null}
            {budgetSummary.overCategories.length > 1 ? (
              <p className="mt-1 text-sm font-semibold">
                {budgetSummary.overCategories.length} categories are over budget.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            No budgets yet. A monthly limit shows whether you&apos;re on track.
          </p>
        )}
        <Link
          href="/budgets"
          className="mt-3 inline-flex text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
          View budgets
        </Link>
      </section>

      <section>
        <h2 className="font-semibold">Recent transactions</h2>
        {ready && transactions.length === 0 ? (
          <EmptyState
            title="No expenses yet"
            body="Add your first expense to see where your money goes."
            actionHref="/add"
            actionLabel="Add"
          />
        ) : (
          <TransactionRows limit={5} />
        )}
      </section>
    </div>
  );
}
