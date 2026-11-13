"use client";

import { useAccounts } from "@/components/accounts/accounts-provider";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function AccountSelect({ id, label }: { id: string; label: string }) {
  const { accounts, ready } = useAccounts();
  const active = accounts.filter((account) => !account.isArchived);
  const disabled = !ready || active.length === 0;

  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-semibold">
      {label}
      <select id={id} name={id} required disabled={disabled} className={fieldClassName} defaultValue="">
        <option value="" disabled>
          {disabled ? "No accounts yet" : "Choose an account"}
        </option>
        {active.map((account) => (
          <option key={account.id} value={account.id}>
            {account.name}
          </option>
        ))}
      </select>
    </label>
  );
}

export function AccountsSaveNote({ kind }: { kind: "expense" | "income" | "transfer" }) {
  const { accounts, ready } = useAccounts();
  const activeCount = accounts.filter((account) => !account.isArchived).length;

  let message = "Loading accounts…";
  if (ready && kind === "transfer") {
    message =
      activeCount < 2
        ? "Add two accounts before moving money between them."
        : "Saving a transfer is the next step.";
  } else if (ready) {
    message =
      activeCount === 0
        ? "Add an account in Settings before saving."
        : kind === "expense"
          ? "Saving an expense is the next step."
          : "Saving income is the next step.";
  }

  return (
    <p id="save-note" className="text-sm leading-6 text-muted-foreground">
      {message}
    </p>
  );
}
