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

export function isExpenseCategory(value: string): boolean {
  return expenseCategories.some((category) => category === value);
}
