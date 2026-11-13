"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useCategories } from "@/components/categories/categories-provider";
import { AccountSelect } from "@/components/accounts/account-select";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { namesFor } from "@/lib/categories";
import { isIsoDate } from "@/lib/dates/iso";
import { minorToInput, parseSgdToMinor } from "@/lib/money/sgd";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function TransactionEditor({ transactionId }: { transactionId: string }) {
  const { transactions, ready } = useTransactions();
  const transaction = transactions.find((item) => item.id === transactionId);

  if (!ready) {
    return <p className="text-sm text-muted-foreground">Loading transaction…</p>;
  }

  if (!transaction) {
    return (
      <div>
        <Link href="/transactions" className={backClassName}>
          Transactions
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Transaction not found</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          That transaction is not on this device.
        </p>
      </div>
    );
  }

  return <TransactionFields key={transaction.id} transactionId={transaction.id} />;
}

function TransactionFields({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const { accounts, ready: accountsReady } = useAccounts();
  const { categories: savedCategories } = useCategories();
  const { transactions, updateTransaction } = useTransactions();
  const transaction = transactions.find((item) => item.id === transactionId);
  const [amount, setAmount] = useState(transaction ? minorToInput(transaction.amountMinor) : "");
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [accountId, setAccountId] = useState(transaction?.accountId ?? "");
  const [toAccountId, setToAccountId] = useState(transaction?.counterAccountId ?? "");
  const [merchant, setMerchant] = useState(transaction?.merchant ?? "");
  const [notes, setNotes] = useState(transaction?.notes ?? "");
  const [error, setError] = useState("");

  if (!transaction) {
    return null;
  }

  const current = transaction;
  const transfer = current.type === "transfer";
  const categories =
    current.type === "transfer"
      ? []
      : namesFor(savedCategories, current.type === "income" ? "income" : "expense", category);
  const active = accounts.filter((account) => !account.isArchived);
  const fieldId = `edit-${current.id}`;
  const typeLabel =
    current.type === "income" ? "Income" : current.type === "expense" ? "Expense" : "Transfer";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minor = parseSgdToMinor(amount);
    const date = String(new FormData(event.currentTarget).get(`${fieldId}-date`) ?? "");
    const account = active.find((item) => item.id === accountId);
    const other = active.find((item) => item.id === toAccountId);

    if (minor === null || minor <= 0) {
      setError("Enter an amount above 0, such as 12.50.");
      return;
    }
    if (!transfer && !categories.some((item) => item === category)) {
      setError("Choose a category.");
      return;
    }
    if (!account) {
      setError("Choose an account.");
      return;
    }
    if (transfer && (!other || other.id === account.id)) {
      setError("Choose two different accounts.");
      return;
    }
    if (!isIsoDate(date)) {
      setError("Choose a date.");
      return;
    }

    updateTransaction(current.id, {
      type: current.type,
      accountId: account.id,
      counterAccountId: transfer ? other?.id : null,
      category: transfer ? null : category,
      amountMinor: minor,
      transactionDate: date,
      merchant,
      notes,
    });
    router.push("/transactions");
  }

  return (
    <div>
      <Link href="/transactions" className={backClassName}>
        Transactions
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Edit {typeLabel.toLowerCase()}</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {current.recurringId
            ? "This payment came from a schedule. Changing it does not change the schedule."
            : "Update the amount, account, or date. The type stays the same."}
        </p>
      </header>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`${fieldId}-amount`} className="grid gap-1.5 text-sm font-semibold">
          Amount
          <input
            id={`${fieldId}-amount`}
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className={fieldClassName}
          />
        </label>
        {transfer ? null : (
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
        )}
        <AccountSelect
          id={`${fieldId}-account`}
          label={transfer ? "From" : "Account"}
          value={accountId}
          onChange={setAccountId}
        />
        {transfer ? (
          <AccountSelect id={`${fieldId}-to`} label="To" value={toAccountId} onChange={setToAccountId} />
        ) : null}
        <DateField id={`${fieldId}-date`} label="Date" defaultDate={current.transactionDate} />
        {transfer ? null : (
          <>
            <label htmlFor={`${fieldId}-merchant`} className="grid gap-1.5 text-sm font-semibold">
              <span>
                {current.type === "expense" ? "Merchant" : "Source"}
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
          </>
        )}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full text-base" disabled={!accountsReady || active.length === 0}>
          Save changes
        </Button>
      </form>
    </div>
  );
}
