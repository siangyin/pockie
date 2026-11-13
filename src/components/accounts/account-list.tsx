"use client";

import Link from "next/link";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { accountTypeLabel } from "@/lib/accounts/types";
import { accountBalanceMinor } from "@/lib/transactions/balance";
import { formatMinorAsSgd } from "@/lib/money/sgd";

function balanceLabel(accountType: string, minor: number) {
  const amount = formatMinorAsSgd(minor);
  return accountType === "credit_card" ? `Owed ${amount}` : amount;
}

export function AccountList() {
  const { accounts, ready, notice } = useAccounts();
  const { transactions, ready: transactionsReady } = useTransactions();
  const active = accounts.filter((account) => !account.isArchived);
  const archived = accounts.filter((account) => account.isArchived);

  return (
    <div>
      <Link
        href="/settings"
        className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Settings
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Accounts</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Cash, bank accounts, credit cards and e-wallets. Balances include the opening amount and saved transactions.
        </p>
      </header>

      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      {!ready ? <p className="text-sm text-muted-foreground">Loading accounts…</p> : null}

      {ready && active.length === 0 && archived.length === 0 ? (
        <EmptyState
          title="No accounts yet"
          body="Add a cash wallet or bank account before you record spending."
          actionHref="/settings/accounts/new"
          actionLabel="Add account"
        />
      ) : null}

      {ready && active.length === 0 && archived.length > 0 ? (
        <div className="mb-6">
          <p className="text-sm leading-6 text-muted-foreground">
            No active accounts. Add one, or restore an archived account below.
          </p>
          <Link
            href="/settings/accounts/new"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            Add account
          </Link>
        </div>
      ) : null}

      {active.length > 0 ? (
        <>
          <ul className="grid gap-3">
            {active.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/settings/accounts/${account.id}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                >
                  <span>
                    <span className="block font-bold">{account.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {accountTypeLabel(account.accountType)}
                    </span>
                  </span>
                  <span className="text-right font-extrabold">
                    {balanceLabel(
                      account.accountType,
                      transactionsReady
                        ? accountBalanceMinor(account, transactions)
                        : account.openingBalanceMinor,
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/settings/accounts/new"
            className="mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            Add account
          </Link>
        </>
      ) : null}

      {archived.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Archived</h2>
          <ul className="mt-3 grid gap-3">
            {archived.map((account) => (
              <li key={account.id}>
                <Link
                  href={`/settings/accounts/${account.id}`}
                  className="flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
                >
                  <span>
                    <span className="block font-bold">{account.name}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">
                      {accountTypeLabel(account.accountType)}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Archived</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
