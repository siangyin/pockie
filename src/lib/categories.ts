export type CategoryType = "expense" | "income";

export type Category = {
  id: string;
  name: string;
  categoryType: CategoryType;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
};

export function isCategoryType(value: string): value is CategoryType {
  return value === "expense" || value === "income";
}

export function categoryTypeLabel(type: CategoryType) {
  return type === "expense" ? "Spending" : "Income";
}

export function namesFor(categories: Category[], type: CategoryType, include?: string | null) {
  const names = categories
    .filter((category) => category.categoryType === type && !category.isArchived)
    .map((category) => category.name);
  if (include && !names.includes(include)) {
    return [include, ...names];
  }
  return names;
}

export const expenseCategories = [
  "Food & Drinks",
  "Groceries",
  "Transport",
  "Shopping",
  "Housing",
  "Utilities",
  "Subscriptions",
  "Healthcare",
  "Insurance",
  "Entertainment",
  "Travel",
  "Family",
  "Other",
] as const;

export const incomeCategories = [
  "Salary",
  "Bonus",
  "Freelance",
  "Interest",
  "Dividends",
  "Gifts",
  "Refunds",
  "Other Income",
] as const;

const storageKey = "pockie.categories";

function isCategory(value: unknown): value is Category {
  if (!value || typeof value !== "object") {
    return false;
  }

  const category = value as Category;
  return (
    typeof category.id === "string" &&
    typeof category.name === "string" &&
    isCategoryType(category.categoryType) &&
    typeof category.isArchived === "boolean" &&
    typeof category.createdAt === "string" &&
    typeof category.updatedAt === "string"
  );
}

export function seedCategories(now: string): Category[] {
  const rows = [
    ...expenseCategories.map((name) => ({ name, categoryType: "expense" as const })),
    ...incomeCategories.map((name) => ({ name, categoryType: "income" as const })),
  ];

  return rows.map((row) => ({
    id: crypto.randomUUID(),
    name: row.name,
    categoryType: row.categoryType,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  }));
}

export function readCategories(): Category[] | null {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCategory);
  } catch {
    return [];
  }
}

export function writeCategories(categories: Category[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(categories));
}
