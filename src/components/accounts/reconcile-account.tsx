"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { formatDisplayDate, isIsoDate } from "@/lib/dates/iso";
import { singaporeDate } from "@/lib/dates/month";
import { formatMinorAsSgd, parseSgdToMinor } from "@/lib/money/sgd";
import { accountBalanceAsOf, movementMinor } from "@/lib/transactions/balance";
import type { Account } from "@/lib/accounts/types";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

function shownBalance(account: Account, minor: number) {
  const amount = formatMinorAsSgd(minor);
  return account.accountType === "credit_card" ? `Owed ${amount}` : amount;
}

function differenceCopy(account: Account, difference: number) {
  if (difference === 0) {
    return "Pockie matches this statement.";
  }
  const amount = formatMinorAsSgd(Math.abs(difference));
  if (account.accountType === "credit_card") {
    return difference > 0
      ? `The statement says you owe ${amount} more than Pockie.`
      : `The statement says you owe ${amount} less than Pockie.`;
  }
  return difference > 0
    ? `The statement is ${amount} higher than Pockie.`
    : `The statement is ${amount} lower than Pockie.`;
}

export function ReconcileAccount({ accountId }: { accountId: string }) {
  const { accounts, ready } = useAccounts();
  const { transactions, ready: transactionsReady, notice, addTransaction } = useTransactions();
  const [statementDate, setStatementDate] = useState("");
  const [statementBalance, setStatementBalance] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setStatementDate(singaporeDate());
  }, []);

  if (!ready || !transactionsReady || !statementDate) {
    return <p className="text-sm text-muted-foreground">Loading account…</p>;
  }

  const account = accounts.find((item) => item.id === accountId);
  if (!account) {
    return (
      <div>
        <Link href="/settings/accounts" className={backClassName}>
          Accounts
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Account not found</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">That account is not on this device.</p>
      </div>
    );
  }

  const dateReady = isIsoDate(statementDate);
  const beforeOpening = dateReady && statementDate < account.openingBalanceDate;
  const statementMinor = parseSgdToMinor(statementBalance);
  const bookMinor = dateReady ? accountBalanceAsOf(account, transactions, statementDate) : null;
  const difference = statementMinor !== null && bookMinor !== null ? statementMinor - bookMinor : null;
  const hasLater =
    dateReady &&
    transactions.some(
      (transaction) =>
        transaction.transactionDate > statementDate && movementMinor(account, transaction) !== 0,
    );
  const fieldId = `reconcile-${account.id}`;

  function matchStatement() {
    if (!account || !dateReady || beforeOpening || statementMinor === null || bookMinor === null) {
      setError(
        statementMinor === null ? "Enter an amount in dollars and cents, such as 12.50." : "Choose a statement date.",
      );
      return;
    }
    if (statementDate < account.openingBalanceDate) {
      setError(`Choose a statement date on or after ${formatDisplayDate(account.openingBalanceDate)}.`);
      return;
    }
    const gap = statementMinor - bookMinor;
    if (gap === 0) {
      setError("");
      return;
    }
    addTransaction(
      {
        type: "adjustment",
        accountId: account.id,
        amountMinor: Math.abs(gap),
        transactionDate: statementDate,
        direction: gap > 0 ? "up" : "down",
        notes: `Statement on ${formatDisplayDate(statementDate)}.`,
      },
      "Balance matched to your statement.",
    );
    setError("");
  }

  return (
    <div>
      <Link href={`/settings/accounts/${account.id}`} className={backClassName}>
        {account.name}
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Reconcile</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Compare {account.name} with a statement. An adjustment changes this balance only. It is not income or
          spending.
        </p>
      </header>
      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}
      <div className="grid gap-4">
        <label htmlFor={`${fieldId}-date`} className="grid gap-1.5 text-sm font-semibold">
          Statement date
          <input
            id={`${fieldId}-date`}
            type="date"
            value={statementDate}
            onChange={(event) => {
              setStatementDate(event.target.value);
              setError("");
            }}
            className={fieldClassName}
          />
        </label>
        <label htmlFor={`${fieldId}-balance`} className="grid gap-1.5 text-sm font-semibold">
          {account.accountType === "credit_card" ? "Amount owed on the statement" : "Statement balance"}
          <input
            id={`${fieldId}-balance`}
            inputMode="decimal"
            value={statementBalance}
            onChange={(event) => {
              setStatementBalance(event.target.value);
              setError("");
            }}
            placeholder="0.00"
            aria-invalid={error ? true : undefined}
            className={fieldClassName}
          />
        </label>
        {beforeOpening ? (
          <p className="text-sm text-destructive">
            Choose a statement date on or after {formatDisplayDate(account.openingBalanceDate)}.
          </p>
        ) : null}
        {dateReady && !beforeOpening && bookMinor !== null ? (
          <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border">
            <p className="text-sm text-muted-foreground">Pockie on {formatDisplayDate(statementDate)}</p>
            <p className="mt-1 text-xl font-extrabold">{shownBalance(account, bookMinor)}</p>
            {difference !== null ? (
              <p className="mt-3 text-sm font-semibold leading-6">{differenceCopy(account, difference)}</p>
            ) : null}
            {hasLater ? (
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Transactions after this date stay on the account.
              </p>
            ) : null}
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {difference !== null && difference !== 0 && !beforeOpening ? (
          <Button type="button" className="h-12 w-full text-base" onClick={matchStatement}>
            Match the statement
          </Button>
        ) : null}
      </div>
    </div>
  );
}
