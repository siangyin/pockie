"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { Account, AccountType } from "@/lib/accounts/types";
import { readAccounts, writeAccounts } from "@/lib/accounts/storage";

export type AccountInput = {
  name: string;
  accountType: AccountType;
  openingBalanceMinor: number;
  openingBalanceDate: string;
};

type AccountsContextValue = {
  accounts: Account[];
  ready: boolean;
  notice: string | null;
  createAccount: (input: AccountInput) => void;
  updateAccount: (id: string, input: AccountInput) => void;
  archiveAccount: (id: string) => void;
  restoreAccount: (id: string) => void;
};

const AccountsContext = createContext<AccountsContextValue | null>(null);

export function AccountsProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setAccounts(readAccounts());
    setReady(true);
  }, []);

  const value = useMemo<AccountsContextValue>(() => {
    function commit(next: Account[], message: string) {
      writeAccounts(next);
      setAccounts(next);
      setNotice(message);
    }

    return {
      accounts,
      ready,
      notice,
      createAccount(input) {
        const now = new Date().toISOString();
        const account: Account = {
          id: crypto.randomUUID(),
          name: input.name,
          accountType: input.accountType,
          currency: "SGD",
          openingBalanceMinor: input.openingBalanceMinor,
          openingBalanceDate: input.openingBalanceDate,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        };
        commit([account, ...accounts], "Account added.");
      },
      updateAccount(id, input) {
        const now = new Date().toISOString();
        commit(
          accounts.map((account) =>
            account.id === id
              ? {
                  ...account,
                  ...input,
                  updatedAt: now,
                }
              : account,
          ),
          "Account updated.",
        );
      },
      archiveAccount(id) {
        const now = new Date().toISOString();
        commit(
          accounts.map((account) =>
            account.id === id ? { ...account, isArchived: true, updatedAt: now } : account,
          ),
          "Account archived.",
        );
      },
      restoreAccount(id) {
        const now = new Date().toISOString();
        commit(
          accounts.map((account) =>
            account.id === id ? { ...account, isArchived: false, updatedAt: now } : account,
          ),
          "Account restored.",
        );
      },
    };
  }, [accounts, notice, ready]);

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
}

export function useAccounts() {
  const value = useContext(AccountsContext);
  if (!value) {
    throw new Error("useAccounts must be used within AccountsProvider");
  }
  return value;
}
