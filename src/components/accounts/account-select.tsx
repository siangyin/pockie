"use client";

import { useAccounts } from "@/components/accounts/accounts-provider";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function AccountSelect({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { accounts, ready } = useAccounts();
  const active = accounts.filter((account) => !account.isArchived);
  const disabled = !ready || active.length === 0;

  return (
    <label htmlFor={id} className="grid gap-1.5 text-sm font-semibold">
      {label}
      <select
        id={id}
        name={id}
        required
        disabled={disabled}
        value={disabled ? "" : value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
      >
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
