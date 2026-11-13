"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDisplayDate } from "@/lib/dates/iso";
import { singaporeDate } from "@/lib/dates/month";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function PreferencesPanel() {
  const [today, setToday] = useState<string | null>(null);

  useEffect(() => {
    setToday(singaporeDate());
  }, []);

  return (
    <div>
      <Link href="/settings" className={backClassName}>
        Settings
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Preferences</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Singapore dollars, and dates in Asia/Singapore.
        </p>
      </header>
      <dl className="grid gap-3">
        <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
          <dt className="text-sm font-semibold text-muted-foreground">Currency</dt>
          <dd className="mt-1 font-bold">Singapore dollars (S$)</dd>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            S$12.50 is stored as 1250 cents, so amounts stay exact.
          </dd>
        </div>
        <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
          <dt className="text-sm font-semibold text-muted-foreground">Time zone</dt>
          <dd className="mt-1 font-bold">Asia/Singapore</dd>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            Months and today follow the Singapore calendar.
          </dd>
        </div>
        <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
          <dt className="text-sm font-semibold text-muted-foreground">Dates</dt>
          <dd className="mt-1 font-bold">{today ? formatDisplayDate(today) : "DD/MM/YYYY"}</dd>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            {today ? "Today in Singapore, shown as day/month/year." : "Shown as day/month/year."}
          </dd>
        </div>
      </dl>
    </div>
  );
}
