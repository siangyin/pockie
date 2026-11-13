"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  readCategories,
  seedCategories,
  writeCategories,
  type Category,
  type CategoryType,
} from "@/lib/categories";

type CategoriesContextValue = {
  categories: Category[];
  ready: boolean;
  notice: string | null;
  createCategory: (name: string, categoryType: CategoryType) => void;
  renameCategory: (id: string, name: string) => void;
  archiveCategory: (id: string) => void;
  restoreCategory: (id: string) => void;
};

const CategoriesContext = createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const stored = readCategories();
    if (stored === null) {
      const seeded = seedCategories(new Date().toISOString());
      writeCategories(seeded);
      setCategories(seeded);
    } else {
      setCategories(stored);
    }
    setReady(true);
  }, []);

  const value = useMemo<CategoriesContextValue>(() => {
    function commit(next: Category[], message: string) {
      writeCategories(next);
      setCategories(next);
      setNotice(message);
    }

    return {
      categories,
      ready,
      notice,
      createCategory(name, categoryType) {
        const now = new Date().toISOString();
        const category: Category = {
          id: crypto.randomUUID(),
          name,
          categoryType,
          isArchived: false,
          createdAt: now,
          updatedAt: now,
        };
        commit([category, ...categories], "Category added.");
      },
      renameCategory(id, name) {
        const now = new Date().toISOString();
        commit(
          categories.map((category) =>
            category.id === id ? { ...category, name, updatedAt: now } : category,
          ),
          "Category updated.",
        );
      },
      archiveCategory(id) {
        const now = new Date().toISOString();
        commit(
          categories.map((category) =>
            category.id === id ? { ...category, isArchived: true, updatedAt: now } : category,
          ),
          "Category archived.",
        );
      },
      restoreCategory(id) {
        const now = new Date().toISOString();
        commit(
          categories.map((category) =>
            category.id === id ? { ...category, isArchived: false, updatedAt: now } : category,
          ),
          "Category restored.",
        );
      },
    };
  }, [categories, notice, ready]);

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const value = useContext(CategoriesContext);
  if (!value) {
    throw new Error("useCategories must be used within CategoriesProvider");
  }
  return value;
}
