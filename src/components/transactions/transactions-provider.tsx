"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AdjustmentDirection, Transaction, TransactionType } from "@/lib/transactions/types";
import { readTransactions, writeTransactions } from "@/lib/transactions/storage";

export type TransactionInput = {
  type: TransactionType;
  accountId: string;
  counterAccountId?: string | null;
  category?: string | null;
  amountMinor: number;
  transactionDate: string;
  merchant?: string;
  notes?: string;
  direction?: AdjustmentDirection | null;
};

function storedDirection(input: TransactionInput): AdjustmentDirection | null {
  if (input.type !== "adjustment") {
    return null;
  }
  return input.direction === "down" ? "down" : "up";
}

type TransactionsContextValue = {
  transactions: Transaction[];
  ready: boolean;
  notice: string | null;
  addTransaction: (input: TransactionInput, message: string) => void;
  updateTransaction: (id: string, input: TransactionInput) => void;
  deleteTransaction: (id: string) => void;
  recordGenerated: (additions: Transaction[]) => void;
  importTransactions: (inputs: TransactionInput[]) => void;
  replaceCategoryName: (type: "expense" | "income", from: string, to: string) => void;
};

const TransactionsContext = createContext<TransactionsContextValue | null>(null);

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setTransactions(readTransactions());
    setReady(true);
  }, []);

  const value = useMemo<TransactionsContextValue>(() => {
    function commit(next: Transaction[], message: string) {
      writeTransactions(next);
      setTransactions(next);
      setNotice(message);
    }

    return {
      transactions,
      ready,
      notice,
      addTransaction(input, message) {
        const now = new Date().toISOString();
        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: input.type,
          accountId: input.accountId,
          counterAccountId: input.counterAccountId ?? null,
          category: input.category ?? null,
          amountMinor: input.amountMinor,
          currency: "SGD",
          transactionDate: input.transactionDate,
          merchant: input.merchant?.trim() ?? "",
          notes: input.notes?.trim() ?? "",
          direction: storedDirection(input),
          recurringId: null,
          occurrenceDate: null,
          createdAt: now,
          updatedAt: now,
        };
        commit([transaction, ...transactions], message);
      },
      updateTransaction(id, input) {
        const now = new Date().toISOString();
        commit(
          readTransactions().map((transaction) =>
            transaction.id === id
              ? {
                  ...transaction,
                  accountId: input.accountId,
                  counterAccountId: input.counterAccountId ?? null,
                  category: input.category ?? null,
                  amountMinor: input.amountMinor,
                  transactionDate: input.transactionDate,
                  merchant: input.merchant?.trim() ?? "",
                  notes: input.notes?.trim() ?? "",
                  direction: storedDirection(input),
                  updatedAt: now,
                }
              : transaction,
          ),
          "Transaction updated.",
        );
      },
      deleteTransaction(id) {
        commit(
          transactions.filter((transaction) => transaction.id !== id),
          "Transaction deleted.",
        );
      },
      recordGenerated(additions) {
        if (additions.length === 0) {
          return;
        }
        const stored = readTransactions();
        const seen = new Set(
          stored
            .filter((transaction) => transaction.recurringId && transaction.occurrenceDate)
            .map((transaction) => `${transaction.recurringId}|${transaction.occurrenceDate}`),
        );
        const fresh = additions.filter(
          (transaction) => !seen.has(`${transaction.recurringId}|${transaction.occurrenceDate}`),
        );
        if (fresh.length === 0) {
          return;
        }
        commit(
          [...fresh, ...stored],
          fresh.length === 1 ? "Recurring payment added." : "Recurring payments added.",
        );
      },
      replaceCategoryName(type, from, to) {
        if (from === to) {
          return;
        }
        const now = new Date().toISOString();
        const stored = readTransactions();
        let changed = false;
        const next = stored.map((transaction) => {
          if (transaction.type !== type || transaction.category !== from) {
            return transaction;
          }
          changed = true;
          return { ...transaction, category: to, updatedAt: now };
        });
        if (!changed) {
          return;
        }
        writeTransactions(next);
        setTransactions(next);
      },
      importTransactions(inputs) {
        if (inputs.length === 0) {
          return;
        }
        const now = new Date().toISOString();
        const created = inputs.map((input) => ({
          id: crypto.randomUUID(),
          type: input.type,
          accountId: input.accountId,
          counterAccountId: input.counterAccountId ?? null,
          category: input.category ?? null,
          amountMinor: input.amountMinor,
          currency: "SGD" as const,
          transactionDate: input.transactionDate,
          merchant: input.merchant?.trim() ?? "",
          notes: input.notes?.trim() ?? "",
          direction: storedDirection(input),
          recurringId: null,
          occurrenceDate: null,
          createdAt: now,
          updatedAt: now,
        }));
        commit(
          [...created, ...readTransactions()],
          created.length === 1 ? "1 transaction imported." : `${created.length} transactions imported.`,
        );
      },
    };
  }, [notice, ready, transactions]);

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export function useTransactions() {
  const value = useContext(TransactionsContext);
  if (!value) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return value;
}
