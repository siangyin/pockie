"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccounts, type AccountInput } from "@/components/accounts/accounts-provider";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";
import { accountTypes, isAccountType, type Account } from "@/lib/accounts/types";
import { formatMinorAsSgd, minorToInput, parseSgdToMinor } from "@/lib/money/sgd";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function AccountForm({ accountId }: { accountId?: string }) {
  const { accounts, ready } = useAccounts();

  if (accountId && !ready) {
    return <p className="text-sm text-muted-foreground">Loading account…</p>;
  }

  const existing = accountId ? accounts.find((account) => account.id === accountId) : undefined;

  if (accountId && !existing) {
    return (
      <div>
        <Link href="/settings/accounts" className={backClassName}>
          Accounts
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Account not found</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          That account is not on this device.
        </p>
      </div>
    );
  }

  return <AccountEditor key={existing?.id ?? "new"} existing={existing} />;
}

function AccountEditor({ existing }: { existing?: Account }) {
  const router = useRouter();
  const { ready, createAccount, updateAccount, archiveAccount, restoreAccount } = useAccounts();
  const [name, setName] = useState(existing?.name ?? "");
  const [accountType, setAccountType] = useState(existing?.accountType ?? "bank");
  const [balance, setBalance] = useState(existing ? minorToInput(existing.openingBalanceMinor) : "");
  const [nameError, setNameError] = useState("");
  const [balanceError, setBalanceError] = useState("");
  const fieldId = existing ? `account-${existing.id}` : "new-account";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    const nextDate = String(new FormData(event.currentTarget).get(`${fieldId}-date`) ?? "");
    const minor = parseSgdToMinor(balance);
    const nextNameError = nextName ? "" : "Enter a name.";
    const nextBalanceError =
      minor === null ? "Enter an amount in dollars and cents, such as 12.50." : "";

    setNameError(nextNameError);
    setBalanceError(nextBalanceError);
    if (!ready || !nextName || minor === null || !isAccountType(accountType) || !nextDate) {
      return;
    }

    const input: AccountInput = {
      name: nextName,
      accountType,
      openingBalanceMinor: minor,
      openingBalanceDate: nextDate,
    };

    if (existing) {
      updateAccount(existing.id, input);
    } else {
      createAccount(input);
    }

    router.push("/settings/accounts");
  }

  return (
    <div>
      <Link href="/settings/accounts" className={backClassName}>
        Accounts
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {existing ? "Edit account" : "Add account"}
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {accountType === "credit_card"
            ? "For a credit card, the opening balance is the amount you currently owe."
            : "The opening balance is the amount in this account today."}
        </p>
      </header>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`${fieldId}-name`} className="grid gap-1.5 text-sm font-semibold">
          Name
          <input
            id={`${fieldId}-name`}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={40}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "name-error" : undefined}
            className={fieldClassName}
          />
        </label>
        {nameError ? (
          <p id="name-error" className="text-sm text-destructive">
            {nameError}
          </p>
        ) : null}

        <label htmlFor={`${fieldId}-type`} className="grid gap-1.5 text-sm font-semibold">
          Type
          <select
            id={`${fieldId}-type`}
            name="accountType"
            value={accountType}
            onChange={(event) => {
              if (isAccountType(event.target.value)) {
                setAccountType(event.target.value);
              }
            }}
            className={fieldClassName}
          >
            {accountTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={`${fieldId}-balance`} className="grid gap-1.5 text-sm font-semibold">
          Opening balance
          <input
            id={`${fieldId}-balance`}
            name="openingBalance"
            inputMode="decimal"
            value={balance}
            onChange={(event) => setBalance(event.target.value)}
            placeholder="0.00"
            required
            aria-invalid={balanceError ? true : undefined}
            aria-describedby={balanceError ? "balance-error" : undefined}
            className={fieldClassName}
          />
        </label>
        {balanceError ? (
          <p id="balance-error" className="text-sm text-destructive">
            {balanceError}
          </p>
        ) : null}

        <DateField
          id={`${fieldId}-date`}
          label="Opening date"
          defaultDate={existing?.openingBalanceDate}
        />

        <Button type="submit" className="h-12 w-full text-base" disabled={!ready}>
          {existing ? "Save account" : "Add account"}
        </Button>
      </form>

      {existing ? (
        <div className="mt-6">
          <p className="text-sm leading-6 text-muted-foreground">
            Current opening balance: {formatMinorAsSgd(existing.openingBalanceMinor)}. Archiving
            hides the account without deleting it.
          </p>
          <Link href={`/settings/accounts/${existing.id}/reconcile`} className={`mt-3 inline-block ${backClassName}`}>
            Reconcile with a statement
          </Link>
          {existing.isArchived ? (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-12 w-full text-base"
              onClick={() => {
                restoreAccount(existing.id);
                router.push("/settings/accounts");
              }}
            >
              Restore account
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-12 w-full text-base"
              onClick={() => {
                archiveAccount(existing.id);
                router.push("/settings/accounts");
              }}
            >
              Archive account
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
