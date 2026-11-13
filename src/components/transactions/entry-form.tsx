"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { AccountSelect } from "@/components/accounts/account-select";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { expenseCategories, incomeCategories } from "@/lib/categories";
import { parseSgdToMinor } from "@/lib/money/sgd";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function EntryForm({ kind }: { kind: "expense" | "income" }) {
  const router = useRouter();
  const expense = kind === "expense";
  const categories: readonly string[] = expense ? expenseCategories : incomeCategories;
  const { accounts, ready: accountsReady } = useAccounts();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [merchant, setMerchant] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const active = accounts.filter((account) => !account.isArchived);
  const canSave = accountsReady && active.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minor = parseSgdToMinor(amount);
    const date = String(new FormData(event.currentTarget).get(`${kind}-date`) ?? "");
    const account = active.find((item) => item.id === accountId);

    if (minor === null || minor <= 0) {
      setError("Enter an amount above 0, such as 12.50.");
      return;
    }
    if (!categories.includes(category)) {
      setError("Choose a category.");
      return;
    }
    if (!account) {
      setError("Choose an account.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Choose a date.");
      return;
    }

    addTransaction(
      {
        type: kind,
        accountId: account.id,
        category,
        amountMinor: minor,
        transactionDate: date,
        merchant,
        notes,
      },
      expense ? "Expense added." : "Income added.",
    );
    router.push("/");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <label htmlFor={`${kind}-amount`} className="grid gap-1.5 text-sm font-semibold">
        Amount
        <input
          id={`${kind}-amount`}
          name="amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
          className={fieldClassName}
        />
      </label>

      <label htmlFor={`${kind}-category`} className="grid gap-1.5 text-sm font-semibold">
        Category
        <select
          id={`${kind}-category`}
          name="category"
          required
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

      <AccountSelect id={`${kind}-account`} label="Account" value={accountId} onChange={setAccountId} />

      <DateField id={`${kind}-date`} label="Date" />

      <label htmlFor={`${kind}-merchant`} className="grid gap-1.5 text-sm font-semibold">
        <span>
          {expense ? "Merchant" : "Source"}
          <span className="font-medium text-muted-foreground"> (optional)</span>
        </span>
        <input
          id={`${kind}-merchant`}
          name="merchant"
          value={merchant}
          onChange={(event) => setMerchant(event.target.value)}
          className={fieldClassName}
        />
      </label>

      <label htmlFor={`${kind}-notes`} className="grid gap-1.5 text-sm font-semibold">
        <span>
          Notes
          <span className="font-medium text-muted-foreground"> (optional)</span>
        </span>
        <textarea
          id={`${kind}-notes`}
          name="notes"
          rows={3}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          className="w-full rounded-xl border border-input bg-card px-3 py-3 text-base font-medium"
        />
      </label>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button type="submit" className="h-12 w-full text-base" disabled={!canSave}>
        {expense ? "Save expense" : "Save income"}
      </Button>
      {!canSave ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Add an account in Settings before saving.
        </p>
      ) : null}
    </form>
  );
}
