"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { AccountSelect } from "@/components/accounts/account-select";
import { useRecurring } from "@/components/recurring/recurring-provider";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";
import { expenseCategories, incomeCategories } from "@/lib/categories";
import { isIsoDate } from "@/lib/dates/iso";
import { minorToInput, parseSgdToMinor } from "@/lib/money/sgd";
import { frequencies, frequencyLabels, isFrequency } from "@/lib/recurring/types";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function RecurringForm({ scheduleId }: { scheduleId?: string }) {
  const { schedules, ready } = useRecurring();

  if (scheduleId && !ready) {
    return <p className="text-sm text-muted-foreground">Loading schedule…</p>;
  }

  const existing = scheduleId ? schedules.find((schedule) => schedule.id === scheduleId) : undefined;

  if (scheduleId && !existing) {
    return (
      <div>
        <Link href="/settings/recurring" className={backClassName}>
          Recurring
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Schedule not found</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          That schedule is not on this device.
        </p>
      </div>
    );
  }

  return <ScheduleEditor key={existing?.id ?? "new"} scheduleId={existing?.id} />;
}

function ScheduleEditor({ scheduleId }: { scheduleId?: string }) {
  const router = useRouter();
  const { accounts, ready: accountsReady } = useAccounts();
  const { schedules, ready, saveSchedule, setPaused, deleteSchedule } = useRecurring();
  const existing = schedules.find((schedule) => schedule.id === scheduleId);
  const [kind, setKind] = useState<"expense" | "income">(existing?.type ?? "expense");
  const [amount, setAmount] = useState(existing ? minorToInput(existing.amountMinor) : "");
  const [category, setCategory] = useState(existing?.category ?? "");
  const [accountId, setAccountId] = useState(existing?.accountId ?? "");
  const [frequency, setFrequency] = useState(existing?.frequency ?? "monthly");
  const [merchant, setMerchant] = useState(existing?.merchant ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [error, setError] = useState("");
  const categories = kind === "expense" ? expenseCategories : incomeCategories;
  const active = accounts.filter((account) => !account.isArchived);
  const fieldId = existing ? `schedule-${existing.id}` : "new-schedule";
  const canSave = ready && accountsReady && active.length > 0;

  function handleKind(nextKind: "expense" | "income") {
    setKind(nextKind);
    const nextCategories = nextKind === "expense" ? expenseCategories : incomeCategories;
    if (!nextCategories.some((item) => item === category)) {
      setCategory("");
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minor = parseSgdToMinor(amount);
    const date = String(new FormData(event.currentTarget).get(`${fieldId}-date`) ?? "");
    const account = active.find((item) => item.id === accountId);

    if (minor === null || minor <= 0) {
      setError("Enter an amount above 0, such as 12.50.");
      return;
    }
    if (!categories.some((item) => item === category)) {
      setError("Choose a category.");
      return;
    }
    if (!account) {
      setError("Choose an account.");
      return;
    }
    if (!isFrequency(frequency)) {
      setError("Choose how often it repeats.");
      return;
    }
    if (!isIsoDate(date)) {
      setError("Choose a start date.");
      return;
    }

    saveSchedule(
      {
        type: kind,
        accountId: account.id,
        category,
        amountMinor: minor,
        frequency,
        startDate: date,
        merchant,
        notes,
      },
      existing?.id,
    );
    router.push("/settings/recurring");
  }

  return (
    <div>
      <Link href="/settings/recurring" className={backClassName}>
        Recurring
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {existing ? "Edit schedule" : "New schedule"}
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          A schedule is not a payment until its due date. Pockie then adds it for you.
        </p>
      </header>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`${fieldId}-kind`} className="grid gap-1.5 text-sm font-semibold">
          Type
          <select
            id={`${fieldId}-kind`}
            value={kind}
            onChange={(event) => handleKind(event.target.value === "income" ? "income" : "expense")}
            className={fieldClassName}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </label>
        <label htmlFor={`${fieldId}-amount`} className="grid gap-1.5 text-sm font-semibold">
          Amount
          <input
            id={`${fieldId}-amount`}
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label htmlFor={`${fieldId}-category`} className="grid gap-1.5 text-sm font-semibold">
          Category
          <select
            id={`${fieldId}-category`}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className={fieldClassName}
          >
            <option value="" disabled>
              Choose a category
            </option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <AccountSelect id={`${fieldId}-account`} label="Account" value={accountId} onChange={setAccountId} />
        <label htmlFor={`${fieldId}-frequency`} className="grid gap-1.5 text-sm font-semibold">
          Repeats
          <select
            id={`${fieldId}-frequency`}
            value={frequency}
            onChange={(event) => {
              if (isFrequency(event.target.value)) {
                setFrequency(event.target.value);
              }
            }}
            className={fieldClassName}
          >
            {frequencies.map((item) => (
              <option key={item} value={item}>
                {frequencyLabels[item]}
              </option>
            ))}
          </select>
        </label>
        <DateField id={`${fieldId}-date`} label="Starts" defaultDate={existing?.startDate} />
        <label htmlFor={`${fieldId}-merchant`} className="grid gap-1.5 text-sm font-semibold">
          <span>
            {kind === "expense" ? "Merchant" : "Source"}
            <span className="font-medium text-muted-foreground"> (optional)</span>
          </span>
          <input
            id={`${fieldId}-merchant`}
            value={merchant}
            onChange={(event) => setMerchant(event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label htmlFor={`${fieldId}-notes`} className="grid gap-1.5 text-sm font-semibold">
          <span>
            Notes
            <span className="font-medium text-muted-foreground"> (optional)</span>
          </span>
          <textarea
            id={`${fieldId}-notes`}
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full rounded-xl border border-input bg-card px-3 py-3 text-base font-medium"
          />
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full text-base" disabled={!canSave}>
          Save schedule
        </Button>
        {!canSave ? (
          <p className="text-sm leading-6 text-muted-foreground">
            Add an account in Settings before saving.
          </p>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            Due dates in the last 60 days are added automatically. Pausing stops future ones.
          </p>
        )}
      </form>
      {existing ? (
        <div className="mt-6 grid gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-base"
            onClick={() => {
              setPaused(existing.id, !existing.isPaused);
              router.push("/settings/recurring");
            }}
          >
            {existing.isPaused ? "Resume schedule" : "Pause schedule"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full text-base"
            onClick={() => {
              deleteSchedule(existing.id);
              router.push("/settings/recurring");
            }}
          >
            Delete schedule
          </Button>
          <p className="text-sm leading-6 text-muted-foreground">
            Deleting the schedule keeps payments that were already added.
          </p>
        </div>
      ) : null}
    </div>
  );
}
