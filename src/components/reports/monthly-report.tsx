"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { spentMinor } from "@/lib/budgets/progress";
import { formatDisplayDate, isIsoDate } from "@/lib/dates/iso";
import { formatYearMonth, isFullMonth, monthBounds, shiftYearMonth, singaporeYearMonth } from "@/lib/dates/month";
import { formatMinorAsSgd } from "@/lib/money/sgd";
import { categorySpending, shareLabel } from "@/lib/reports/summary";
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
  const larger = Math.max(totals.incomeMinor, totals.expenseMinor, 1);
  const kept = totals.remainingMinor;
  const months = Array.from({ length: 6 }, (_, index) => shiftYearMonth(end.slice(0, 7), index - 5));
  const trend = months.map((month) => ({
    yearMonth: month,
    expenseMinor: monthTotals(transactions, month).expenseMinor,
  }));
  const trendMax = Math.max(...trend.map((month) => month.expenseMinor), 1);

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
        <AmountBar label="Income" amountMinor={totals.incomeMinor} width={(totals.incomeMinor / larger) * 100} />
        <AmountBar label="Spending" amountMinor={totals.expenseMinor} width={(totals.expenseMinor / larger) * 100} />
      </section>

      <section>
        <h2 className="font-semibold">By category</h2>
        {categories.length === 0 ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">No spending in {period}.</p>
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
                <p className={monthOverlaps(month.yearMonth, start, end) ? "font-bold" : "text-sm font-semibold"}>
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

function monthOverlaps(yearMonth: string, start: string, end: string) {
  const bounds = monthBounds(yearMonth);
  return bounds.end >= start && bounds.start <= end;
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
