"use client";

import Link from "next/link";
import { useCategories } from "@/components/categories/categories-provider";
import { EmptyState } from "@/components/layout/empty-state";
import { categoryTypeLabel, type Category } from "@/lib/categories";

const addClassName =
  "mt-4 inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

const rowClassName =
  "flex min-h-16 items-center justify-between gap-3 rounded-2xl bg-card px-4 py-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring";

function CategoryRows({ categories, showType = false }: { categories: Category[]; showType?: boolean }) {
  return (
    <ul className="mt-3 grid gap-3">
      {categories.map((category) => (
        <li key={category.id}>
          <Link href={`/settings/categories/${category.id}`} className={rowClassName}>
            <span>
              <span className="block font-bold">{category.name}</span>
              {showType ? (
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {categoryTypeLabel(category.categoryType)}
                </span>
              ) : null}
            </span>
            {category.isArchived ? (
              <span className="text-sm font-semibold text-muted-foreground">Archived</span>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function CategoryList() {
  const { categories, ready, notice } = useCategories();
  const spending = categories.filter((category) => category.categoryType === "expense" && !category.isArchived);
  const income = categories.filter((category) => category.categoryType === "income" && !category.isArchived);
  const archived = categories.filter((category) => category.isArchived);

  return (
    <div>
      <Link
        href="/settings"
        className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Settings
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Categories</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Groups for spending and income. Renaming updates transactions that already use the name.
        </p>
      </header>

      {notice ? (
        <p className="mb-4 rounded-2xl bg-amber-soft px-4 py-3 text-sm font-semibold" role="status">
          {notice}
        </p>
      ) : null}

      {!ready ? <p className="text-sm text-muted-foreground">Loading categories…</p> : null}

      {ready && categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          body="Add a spending or income group before you record a transaction."
          actionHref="/settings/categories/new"
          actionLabel="Add category"
        />
      ) : null}

      {spending.length > 0 ? (
        <section>
          <h2 className="font-semibold">Spending</h2>
          <CategoryRows categories={spending} />
        </section>
      ) : null}

      {income.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Income</h2>
          <CategoryRows categories={income} />
        </section>
      ) : null}

      {ready && categories.length > 0 ? (
        <Link href="/settings/categories/new" className={addClassName}>
          Add category
        </Link>
      ) : null}

      {archived.length > 0 ? (
        <section className="mt-8">
          <h2 className="font-semibold">Archived</h2>
          <CategoryRows categories={archived} showType />
        </section>
      ) : null}
    </div>
  );
}
