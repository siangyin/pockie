"use client";

import Link from "next/link";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useRecurring } from "@/components/recurring/recurring-provider";
import { formatDisplayDate } from "@/lib/dates/iso";
import { formatMinorAsSgd } from "@/lib/money/sgd";
import { nextOccurrence } from "@/lib/recurring/schedule";
import { frequencyLabels } from "@/lib/recurring/types";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function RecurringList() {
  const { accounts } = useAccounts();
  const { schedules, ready, today, notice, setPaused } = useRecurring();

  return (
    <div>
      <Link href="/settings" className={backClassName}>
        Settings
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Recurring</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Regular income and bills. A schedule stays separate from your transactions until the due
          date.
        </p>
      </header>
      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}
      {!ready ? <p className="text-sm text-muted-foreground">Loading schedules…</p> : null}
      {ready && schedules.length === 0 ? (
        <p className="text-sm leading-6 text-muted-foreground">No schedules yet.</p>
      ) : null}
      {schedules.length > 0 ? (
        <ul className="grid gap-3">
          {schedules.map((schedule) => {
            const account = accounts.find((item) => item.id === schedule.accountId);
            const nextDate = today ? nextOccurrence(schedule, today) : null;
            const amount = formatMinorAsSgd(schedule.amountMinor);
            return (
              <li key={schedule.id} className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{schedule.category}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {schedule.type === "income" ? "Income" : "Expense"} · {frequencyLabels[schedule.frequency]} ·{" "}
                      {account?.name ?? "Account"}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {schedule.isPaused
                        ? "Paused"
                        : nextDate
                          ? `Next ${formatDisplayDate(nextDate)}`
                          : "No upcoming date"}
                    </p>
                  </div>
                  <p className="font-extrabold">{schedule.type === "income" ? `+${amount}` : `−${amount}`}</p>
                </div>
                <div className="mt-3 flex gap-4">
                  <Link href={`/settings/recurring/${schedule.id}`} className={backClassName}>
                    Edit
                  </Link>
                  <button type="button" className={backClassName} onClick={() => setPaused(schedule.id, !schedule.isPaused)}>
                    {schedule.isPaused ? "Resume" : "Pause"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
      <Link
        href="/settings/recurring/new"
        className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Add schedule
      </Link>
    </div>
  );
}
