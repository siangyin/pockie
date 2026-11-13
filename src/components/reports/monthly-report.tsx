"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { CategoryBars } from "@/components/charts/category-bars";
import { ColumnChart } from "@/components/charts/column-chart";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { spentMinor } from "@/lib/budgets/progress";
import { formatDisplayDate, isIsoDate } from "@/lib/dates/iso";
import { formatYearMonth, isFullMonth, monthBounds, shiftYearMonth, shortMonth, singaporeYearMonth } from "@/lib/dates/month";
import { formatMinorAsSgd } from "@/lib/money/sgd";
import { categorySpending } from "@/lib/reports/summary";
import { monthTotals, rangeTotals } from "@/lib/transactions/balance";

const linkClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function MonthlyReport() {
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);

  useEffect(() => {
    const bounds = monthBounds(singaporeYearMonth());
    setStart(bounds.start);
    setEnd(bounds.end);
  }, []);

  function showMonth(yearMonth: string) {
    const bounds = monthBounds(yearMonth);
    setStart(bounds.start);
    setEnd(bounds.end);
  }

  if (!start || !end) {
    return <p className="text-sm text-muted-foreground">Loading report…</p>;
  }

  const fullMonth = isIsoDate(start) && isIsoDate(end) && isFullMonth(start, end);
  const label = fullMonth
    ? formatYearMonth(start.slice(0, 7))
    : `${formatDisplayDate(start)} – ${formatDisplayDate(end)}`;

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
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          className={linkClassName}
          onClick={() => showMonth(shiftYearMonth(start.slice(0, 7), -1))}
        >
          Previous
        </button>
        <p className="text-center font-bold">{label}</p>
        <button
          type="button"
          className={linkClassName}
          onClick={() => showMonth(shiftYearMonth(start.slice(0, 7), 1))}
        >
          Next
        </button>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3">
        <label htmlFor="report-from" className="grid gap-1.5 text-sm font-semibold">
          From
          <input
            id="report-from"
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label htmlFor="report-to" className="grid gap-1.5 text-sm font-semibold">
          To
          <input
            id="report-to"
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className={fieldClassName}
          />
        </label>
      </div>
      <ReportRange start={start} end={end} />
    </div>
  );
}

function ReportRange({ start, end }: { start: string; end: string }) {
  const { transactions, ready } = useTransactions();
  const { budgets } = useBudgets();

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading report…</p>;
  }

  if (!isIsoDate(start) || !isIsoDate(end) || start > end) {
    return <p className="text-sm text-destructive">Choose a start date on or before the end date.</p>;
  }

  const fullMonth = isFullMonth(start, end);
  const yearMonth = start.slice(0, 7);
  const totals = rangeTotals(transactions, start, end);
  const categories = categorySpending(transactions, start, end);
  const monthBudgets = fullMonth ? budgets.filter((budget) => budget.yearMonth === yearMonth) : [];
  const kept = totals.remainingMinor;
  const months = Array.from({ length: 6 }, (_, index) => shiftYearMonth(end.slice(0, 7), index - 5));
  const trend = months.map((month) => ({
    yearMonth: month,
    expenseMinor: monthTotals(transactions, month).expenseMinor,
  }));
  const period = fullMonth ? "this month" : "these dates";
  let comparison = `No income or spending in ${period}.`;
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
        <ColumnChart
          caption={`Income ${formatMinorAsSgd(totals.incomeMinor)}, spending ${formatMinorAsSgd(totals.expenseMinor)}`}
          showAmounts
          bars={[
            { key: "income", label: "Income", amountMinor: totals.incomeMinor, tone: "bell" },
            { key: "spending", label: "Spending", amountMinor: totals.expenseMinor, tone: "amber" },
          ]}
        />
      </section>

      <section>
        <h2 className="font-semibold">By category</h2>
        {categories.length === 0 ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">No spending in {period}.</p>
        ) : (
          <CategoryBars items={categories} totalMinor={totals.expenseMinor} />
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
        <div className="mt-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
          <ColumnChart
            caption="Spending in the six months ending on this range"
            bars={trend.map((month) => ({
              key: month.yearMonth,
              label: shortMonth(month.yearMonth),
              amountMinor: month.expenseMinor,
              tone: monthOverlaps(month.yearMonth, start, end) ? "amber" : "bell",
            }))}
          />
        </div>
      </section>
    </div>
  );
}

function monthOverlaps(yearMonth: string, start: string, end: string) {
  const bounds = monthBounds(yearMonth);
  return bounds.end >= start && bounds.start <= end;
}
