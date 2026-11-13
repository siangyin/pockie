"use client";

import { EmptyState } from "@/components/layout/empty-state";
import { TransactionRows } from "@/components/transactions/transaction-rows";
import { useTransactions } from "@/components/transactions/transactions-provider";

export function TransactionList() {
  const { transactions, ready, notice } = useTransactions();

  return (
    <div>
      <header className="mb-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Income, spending and transfers show up here.
        </p>
      </header>
      {notice ? (
        <p className="mt-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}
      {ready && transactions.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          body="Add your first expense to see where your money goes."
          actionHref="/add"
          actionLabel="Add"
        />
      ) : (
        <TransactionRows />
      )}
    </div>
  );
}
