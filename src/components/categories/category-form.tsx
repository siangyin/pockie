"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBudgets } from "@/components/budgets/budgets-provider";
import { useCategories } from "@/components/categories/categories-provider";
import { Button } from "@/components/ui/button";
import { useRecurring } from "@/components/recurring/recurring-provider";
import { useTransactions } from "@/components/transactions/transactions-provider";
import { categoryTypeLabel, isCategoryType, type Category, type CategoryType } from "@/lib/categories";

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

const backClassName =
  "text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

export function CategoryForm({ categoryId }: { categoryId?: string }) {
  const { categories, ready } = useCategories();

  if (categoryId && !ready) {
    return <p className="text-sm text-muted-foreground">Loading category…</p>;
  }

  const existing = categoryId ? categories.find((category) => category.id === categoryId) : undefined;

  if (categoryId && !existing) {
    return (
      <div>
        <Link href="/settings/categories" className={backClassName}>
          Categories
        </Link>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight">Category not found</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          That category is not on this device.
        </p>
      </div>
    );
  }

  return <CategoryEditor key={existing?.id ?? "new"} existing={existing} />;
}

function CategoryEditor({ existing }: { existing?: Category }) {
  const router = useRouter();
  const { categories, ready, createCategory, renameCategory, archiveCategory, restoreCategory } =
    useCategories();
  const { replaceCategoryName: replaceTransactions } = useTransactions();
  const { replaceCategoryName: replaceBudgets } = useBudgets();
  const { replaceCategoryName: replaceSchedules } = useRecurring();
  const [name, setName] = useState(existing?.name ?? "");
  const [categoryType, setCategoryType] = useState<CategoryType>(existing?.categoryType ?? "expense");
  const [error, setError] = useState("");
  const fieldId = existing ? `category-${existing.id}` : "new-category";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    if (!ready) {
      return;
    }
    if (!nextName) {
      setError("Enter a name.");
      return;
    }
    if (nextName.length > 40) {
      setError("Use 40 characters or fewer.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== existing?.id &&
        category.categoryType === categoryType &&
        category.name.toLowerCase() === nextName.toLowerCase(),
    );
    if (duplicate) {
      setError("You already have a category with that name.");
      return;
    }

    if (!existing) {
      createCategory(nextName, categoryType);
      router.push("/settings/categories");
      return;
    }

    const previous = existing.name;
    renameCategory(existing.id, nextName);
    if (previous !== nextName) {
      replaceTransactions(existing.categoryType, previous, nextName);
      replaceSchedules(existing.categoryType, previous, nextName);
      if (existing.categoryType === "expense") {
        replaceBudgets(previous, nextName);
      }
    }
    router.push("/settings/categories");
  }

  return (
    <div>
      <Link href="/settings/categories" className={backClassName}>
        Categories
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">
          {existing ? "Edit category" : "Add category"}
        </h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {existing
            ? "Renaming updates transactions, budgets, and schedules that use this name."
            : "This name appears when you add a transaction or a budget."}
        </p>
      </header>
      <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`${fieldId}-name`} className="grid gap-1.5 text-sm font-semibold">
          Name
          <input
            id={`${fieldId}-name`}
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            maxLength={40}
            className={fieldClassName}
          />
        </label>
        {existing ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {categoryTypeLabel(existing.categoryType)} category.
          </p>
        ) : (
          <label htmlFor={`${fieldId}-type`} className="grid gap-1.5 text-sm font-semibold">
            Used for
            <select
              id={`${fieldId}-type`}
              name="categoryType"
              value={categoryType}
              onChange={(event) => {
                if (isCategoryType(event.target.value)) {
                  setCategoryType(event.target.value);
                }
              }}
              className={fieldClassName}
            >
              <option value="expense">Spending</option>
              <option value="income">Income</option>
            </select>
          </label>
        )}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="h-12 w-full text-base" disabled={!ready}>
          {existing ? "Save category" : "Add category"}
        </Button>
      </form>
      {existing ? (
        <div className="mt-6">
          <p className="text-sm leading-6 text-muted-foreground">
            Archiving hides this category from new transactions. Existing ones keep the name.
          </p>
          {existing.isArchived ? (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-12 w-full text-base"
              onClick={() => {
                restoreCategory(existing.id);
                router.push("/settings/categories");
              }}
            >
              Restore category
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              className="mt-3 h-12 w-full text-base"
              onClick={() => {
                archiveCategory(existing.id);
                router.push("/settings/categories");
              }}
            >
              Archive category
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
