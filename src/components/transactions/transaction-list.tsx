"use client";

import { useMemo, useState } from "react";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useCategories } from "@/components/categories/categories-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { TransactionRows } from "@/components/transactions/transaction-rows";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { isIsoDate } from "@/lib/dates/iso";
import { sortTransactions } from "@/lib/transactions/balance";
import type { TransactionType } from "@/lib/transactions/types";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function TransactionList() {
  const { accounts } = useAccounts();
  const { categories } = useCategories();
  const { transactions, ready, notice } = useTransactions();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"all" | TransactionType>("all");
  const [category, setCategory] = useState("all");
  const [accountId, setAccountId] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [order, setOrder] = useState<"newest" | "oldest">("newest");
  const namedAccounts = useMemo(() => {
    const ids = new Set(transactions.flatMap((transaction) => [transaction.accountId, transaction.counterAccountId]));
    return accounts.filter((account) => ids.has(account.id));
  }, [accounts, transactions]);

  const categoryNames = useMemo(() => {
    const names = new Set<string>();
    for (const item of categories) {
      if (!item.isArchived) {
        names.add(item.name);
      }
    }
    for (const transaction of transactions) {
      if (transaction.category) {
        names.add(transaction.category);
      }
    }
    return [...names].sort((left, right) => left.localeCompare(right));
  }, [categories, transactions]);
  const rangeError = isIsoDate(from) && isIsoDate(to) && from > to;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = transactions.filter((transaction) => {
      if (type !== "all" && transaction.type !== type) {
        return false;
      }
      if (category !== "all" && transaction.category !== category) {
        return false;
      }
      if (isIsoDate(from) && transaction.transactionDate < from) {
        return false;
      }
      if (isIsoDate(to) && transaction.transactionDate > to) {
        return false;
      }
      if (
        accountId !== "all" &&
        transaction.accountId !== accountId &&
        transaction.counterAccountId !== accountId
      ) {
        return false;
      }
      if (!needle) {
        return true;
      }
      const account = accounts.find((item) => item.id === transaction.accountId);
      const other = accounts.find((item) => item.id === transaction.counterAccountId);
      const haystack = [transaction.category, transaction.merchant, transaction.notes, account?.name, other?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
    const sorted = sortTransactions(matched);
    return order === "oldest" ? [...sorted].reverse() : sorted;
  }, [accountId, accounts, category, from, order, query, to, transactions, type]);

  const filtering =
    query.trim() !== "" ||
    type !== "all" ||
    category !== "all" ||
    accountId !== "all" ||
    from !== "" ||
    to !== "" ||
    order !== "newest";

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
      ) : null}
      {ready && transactions.length > 0 ? (
        <>
          <div className="mt-4 grid gap-3">
            <label htmlFor="txn-search" className="grid gap-1.5 text-sm font-semibold">
              Search
              <input
                id="txn-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Category, merchant, or account"
                className={fieldClassName}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label htmlFor="txn-type" className="grid gap-1.5 text-sm font-semibold">
                Type
                <select
                  id="txn-type"
                  value={type}
                  onChange={(event) => setType(event.target.value as "all" | TransactionType)}
                  className={fieldClassName}
                >
                  <option value="all">All</option>
                  <option value="expense">Expenses</option>
                  <option value="income">Income</option>
                  <option value="transfer">Transfers</option>
                </select>
              </label>
              <label htmlFor="txn-order" className="grid gap-1.5 text-sm font-semibold">
                Order
                <select
                  id="txn-order"
                  value={order}
                  onChange={(event) => setOrder(event.target.value === "oldest" ? "oldest" : "newest")}
                  className={fieldClassName}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>
            <label htmlFor="txn-category" className="grid gap-1.5 text-sm font-semibold">
              Category
              <select
                id="txn-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className={fieldClassName}
              >
                <option value="all">All categories</option>
                {categoryNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label htmlFor="txn-from" className="grid gap-1.5 text-sm font-semibold">
                From
                <input
                  id="txn-from"
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className={fieldClassName}
                />
              </label>
              <label htmlFor="txn-to" className="grid gap-1.5 text-sm font-semibold">
                To
                <input
                  id="txn-to"
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className={fieldClassName}
                />
              </label>
            </div>
            <label htmlFor="txn-account" className="grid gap-1.5 text-sm font-semibold">
              Account
              <select
                id="txn-account"
                value={accountId}
                onChange={(event) => setAccountId(event.target.value)}
                className={fieldClassName}
              >
                <option value="all">All accounts</option>
                {namedAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {rangeError ? (
            <p className="mt-4 text-sm text-destructive">Choose a start date on or before the end date.</p>
          ) : filtered.length === 0 ? (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {filtering ? "Nothing matches." : "No transactions yet."}
            </p>
          ) : (
            <TransactionRows items={filtered} />
          )}
        </>
      ) : null}
    </div>
  );
}
