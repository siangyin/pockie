"use client";

import Link from "next/link";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { sortTransactions } from "@/lib/transactions/balance";
import type { Transaction } from "@/lib/transactions/types";
import { formatDisplayDate } from "@/lib/dates/iso";
import { formatMinorAsSgd } from "@/lib/money/sgd";

const actionClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

function amountLabel(transaction: Transaction) {
  const amount = formatMinorAsSgd(transaction.amountMinor);
  if (transaction.type === "income") {
    return `+${amount}`;
  }
  if (transaction.type === "expense") {
    return `−${amount}`;
  }
  if (transaction.type === "adjustment") {
    return transaction.direction === "down" ? `−${amount}` : `+${amount}`;
  }
  return amount;
}

function titleFor(transaction: Transaction) {
  if (transaction.type === "transfer") {
    return "Transfer";
  }
  if (transaction.type === "adjustment") {
    return "Adjustment";
  }
  return transaction.category ?? "Transaction";
}

export function TransactionRows({ items, limit }: { items?: Transaction[]; limit?: number }) {
  const { accounts } = useAccounts();
  const { transactions, ready, deleteTransaction } = useTransactions();
  const source = items ?? sortTransactions(transactions);
  const rows = source.slice(0, limit ?? source.length);

  if (!ready) {
    return <p className="mt-3 text-sm text-muted-foreground">Loading transactions…</p>;
  }

  if (rows.length === 0) {
    return null;
  }

  return (
    <ul className="mt-3 grid gap-3">
      {rows.map((transaction) => {
        const account = accounts.find((item) => item.id === transaction.accountId);
        const other = accounts.find((item) => item.id === transaction.counterAccountId);
        const detail =
          transaction.type === "transfer"
            ? `${account?.name ?? "Account"} to ${other?.name ?? "Account"}`
            : `${account?.name ?? "Account"} · ${formatDisplayDate(transaction.transactionDate)}${transaction.recurringId ? " · Recurring" : ""}`;

        return (
          <li
            key={transaction.id}
            className="rounded-2xl bg-card px-4 py-4 ring-1 ring-border"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">{titleFor(transaction)}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{detail}</p>
                {transaction.merchant ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">{transaction.merchant}</p>
                ) : null}
                {transaction.type === "adjustment" && transaction.notes ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">{transaction.notes}</p>
                ) : null}
              </div>
              <p className="font-extrabold">{amountLabel(transaction)}</p>
            </div>
            <div className="mt-3 flex gap-4">
              <Link href={`/transactions/${transaction.id}`} className={actionClassName}>
                Edit
              </Link>
              <button type="button" className={actionClassName} onClick={() => deleteTransaction(transaction.id)}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
