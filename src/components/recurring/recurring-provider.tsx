"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAccounts } from "@/components/accounts/accounts-provider";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { singaporeDate } from "@/lib/dates/month";
import { dueTransactions } from "@/lib/recurring/schedule";
import { readSchedules, writeSchedules } from "@/lib/recurring/storage";
import type { Frequency, RecurringSchedule } from "@/lib/recurring/types";

export type ScheduleInput = {
  type: "income" | "expense";
  accountId: string;
  category: string;
  amountMinor: number;
  frequency: Frequency;
  startDate: string;
  merchant?: string;
  notes?: string;
};

type RecurringContextValue = {
  schedules: RecurringSchedule[];
  ready: boolean;
  today: string | null;
  notice: string | null;
  saveSchedule: (input: ScheduleInput, id?: string) => void;
  setPaused: (id: string, isPaused: boolean) => void;
  deleteSchedule: (id: string) => void;
};

const RecurringContext = createContext<RecurringContextValue | null>(null);

export function RecurringProvider({ children }: { children: React.ReactNode }) {
  const { accounts, ready: accountsReady } = useAccounts();
  const { transactions, ready: transactionsReady, recordGenerated } = useTransactions();
  const [schedules, setSchedules] = useState<RecurringSchedule[]>([]);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setSchedules(readSchedules());
    setToday(singaporeDate());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !accountsReady || !transactionsReady || !today) {
      return;
    }

    const activeAccountIds = new Set(
      accounts.filter((account) => !account.isArchived).map((account) => account.id),
    );
    const additions = dueTransactions(schedules, transactions, today, activeAccountIds);
    recordGenerated(additions);
  }, [
    accounts,
    accountsReady,
    ready,
    recordGenerated,
    schedules,
    today,
    transactions,
    transactionsReady,
  ]);

  const value = useMemo<RecurringContextValue>(() => {
    function commit(next: RecurringSchedule[], message: string) {
      writeSchedules(next);
      setSchedules(next);
      setNotice(message);
    }

    return {
      schedules,
      ready,
      today,
      notice,
      saveSchedule(input, id) {
        const now = new Date().toISOString();
        const shared = {
          type: input.type,
          accountId: input.accountId,
          category: input.category,
          amountMinor: input.amountMinor,
          currency: "SGD" as const,
          frequency: input.frequency,
          startDate: input.startDate,
          merchant: input.merchant?.trim() ?? "",
          notes: input.notes?.trim() ?? "",
          updatedAt: now,
        };

        if (id) {
          commit(
            schedules.map((schedule) => (schedule.id === id ? { ...schedule, ...shared } : schedule)),
            "Schedule updated.",
          );
          return;
        }

        const schedule: RecurringSchedule = {
          id: crypto.randomUUID(),
          ...shared,
          isPaused: false,
          createdAt: now,
        };
        commit([schedule, ...schedules], "Schedule saved.");
      },
      setPaused(id, isPaused) {
        const now = new Date().toISOString();
        commit(
          schedules.map((schedule) =>
            schedule.id === id ? { ...schedule, isPaused, updatedAt: now } : schedule,
          ),
          isPaused ? "Schedule paused." : "Schedule resumed.",
        );
      },
      deleteSchedule(id) {
        commit(
          schedules.filter((schedule) => schedule.id !== id),
          "Schedule deleted.",
        );
      },
    };
  }, [notice, ready, schedules, today]);

  return <RecurringContext.Provider value={value}>{children}</RecurringContext.Provider>;
}

export function useRecurring() {
  const value = useContext(RecurringContext);
  if (!value) {
    throw new Error("useRecurring must be used within RecurringProvider");
  }
  return value;
}
