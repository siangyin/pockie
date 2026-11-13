"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AccountSelect } from "@/components/accounts/account-select";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { usePreferredAccount } from "@/components/accounts/use-preferred-account";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { rememberTransfer } from "@/lib/accounts/last-used";
import { parseSgdToMinor } from "@/lib/money/sgd";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function TransferForm() {
  const router = useRouter();
  const { accounts, ready } = useAccounts();
  const { addTransaction } = useTransactions();
  const [amount, setAmount] = useState("");
  const [fromId, setFromId] = usePreferredAccount("from");
  const [toId, setToId] = usePreferredAccount("to", "", fromId);
  const [error, setError] = useState("");
  const active = accounts.filter((account) => !account.isArchived);
  const canSave = ready && active.length >= 2;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const minor = parseSgdToMinor(amount);
    const date = String(new FormData(event.currentTarget).get("transfer-date") ?? "");
    const from = active.find((account) => account.id === fromId);
    const to = active.find((account) => account.id === toId);

    if (minor === null || minor <= 0) {
      setError("Enter an amount above 0, such as 12.50.");
      return;
    }
    if (!from || !to) {
      setError("Choose both accounts.");
      return;
    }
    if (from.id === to.id) {
      setError("Choose two different accounts.");
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setError("Choose a date.");
      return;
    }

    rememberTransfer(from.id, to.id);
    addTransaction(
      {
        type: "transfer",
        accountId: from.id,
        counterAccountId: to.id,
        amountMinor: minor,
        transactionDate: date,
      },
      "Transfer added.",
    );
    router.push("/");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <label htmlFor="transfer-amount" className="grid gap-1.5 text-sm font-semibold">
        Amount
        <input
          id="transfer-amount"
          name="amount"
          inputMode="decimal"
          placeholder="0.00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          required
          className={fieldClassName}
        />
      </label>
      <AccountSelect id="transfer-from" label="From" value={fromId} onChange={setFromId} />
      <AccountSelect id="transfer-to" label="To" value={toId} onChange={setToId} />
      <DateField id="transfer-date" label="Date" />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="h-12 w-full text-base" disabled={!canSave}>
        Save transfer
      </Button>
      {!canSave ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Add two accounts before moving money between them.
        </p>
      ) : (
        <p className="text-sm leading-6 text-muted-foreground">
          A transfer does not count as income or spending.
        </p>
      )}
    </form>
  );
}
