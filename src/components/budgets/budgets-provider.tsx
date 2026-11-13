"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Budget } from "@/lib/budgets/types";
import { readBudgets, writeBudgets } from "@/lib/budgets/storage";

type BudgetsContextValue = {
  budgets: Budget[];
  ready: boolean;
  notice: string | null;
  saveBudget: (category: string, yearMonth: string, limitMinor: number) => void;
  deleteBudget: (id: string) => void;
  replaceCategoryName: (from: string, to: string) => void;
};

const BudgetsContext = createContext<BudgetsContextValue | null>(null);

export function BudgetsProvider({ children }: { children: React.ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const newBudgets = readBudgets();
    setBudgets(newBudgets);
    setReady(true);
  }, []);

  const value = useMemo<BudgetsContextValue>(() => {
    function commit(next: Budget[], message: string) {
      writeBudgets(next);
      setBudgets(next);
      setNotice(message);
    }

    return {
      budgets,
      ready,
      notice,
      saveBudget(category, yearMonth, limitMinor) {
        const now = new Date().toISOString();
        const existing = budgets.find(
          (budget) => budget.category === category && budget.yearMonth === yearMonth,
        );

        if (existing) {
          commit(
            budgets.map((budget) =>
              budget.id === existing.id ? { ...budget, limitMinor, updatedAt: now } : budget,
            ),
            "Budget updated.",
          );
          return;
        }

        const budget: Budget = {
          id: crypto.randomUUID(),
          category,
          yearMonth,
          limitMinor,
          createdAt: now,
          updatedAt: now,
        };
        commit([budget, ...budgets], "Budget saved.");
      },
      deleteBudget(id) {
        commit(
          budgets.filter((budget) => budget.id !== id),
          "Budget deleted.",
        );
      },
      replaceCategoryName(from, to) {
        if (from === to) {
          return;
        }
        const now = new Date().toISOString();
        const stored = readBudgets();
        let changed = false;
        const next = stored.map((budget) => {
          if (budget.category !== from) {
            return budget;
          }
          changed = true;
          return { ...budget, category: to, updatedAt: now };
        });
        if (!changed) {
          return;
        }
        writeBudgets(next);
        setBudgets(next);
      },
    };
  }, [budgets, notice, ready]);

  return <BudgetsContext.Provider value={value}>{children}</BudgetsContext.Provider>;
}

export function useBudgets() {
  const value = useContext(BudgetsContext);
  if (!value) {
    throw new Error("useBudgets must be used within BudgetsProvider");
  }
  return value;
}
