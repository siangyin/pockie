import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";

const expenseCategories = [
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
];

const incomeCategories = [
  "Salary",
  "Bonus",
  "Freelance",
  "Interest",
  "Dividends",
  "Gifts",
  "Refunds",
  "Other Income",
];

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export function EntryForm({ kind }: { kind: "expense" | "income" }) {
  const expense = kind === "expense";
  const categories = expense ? expenseCategories : incomeCategories;

  return (
    <form className="grid gap-4" aria-describedby="save-note">
      <label htmlFor="amount" className="grid gap-1.5 text-sm font-semibold">
        Amount
        <input
          id="amount"
          name="amount"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          required
          className={fieldClassName}
        />
      </label>

      <label htmlFor="category" className="grid gap-1.5 text-sm font-semibold">
        Category
        <select id="category" name="category" required className={fieldClassName} defaultValue="">
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="account" className="grid gap-1.5 text-sm font-semibold">
        Account
        <select id="account" name="account" required disabled className={fieldClassName}>
          <option value="">No accounts yet</option>
        </select>
      </label>

      <DateField id="date" label="Date" />

      <label htmlFor="merchant" className="grid gap-1.5 text-sm font-semibold">
        <span>
          {expense ? "Merchant" : "Source"}
          <span className="font-medium text-muted-foreground"> (optional)</span>
        </span>
        <input id="merchant" name="merchant" className={fieldClassName} />
      </label>

      <label htmlFor="notes" className="grid gap-1.5 text-sm font-semibold">
        <span>
          Notes
          <span className="font-medium text-muted-foreground"> (optional)</span>
        </span>
        <textarea id="notes" name="notes" rows={3} className="w-full rounded-xl border border-input bg-card px-3 py-3 text-base font-medium" />
      </label>

      <Button type="button" disabled className="h-12 w-full text-base">
        {expense ? "Save expense" : "Save income"}
      </Button>
      <p id="save-note" className="text-sm leading-6 text-muted-foreground">
        Saving starts once your accounts are set up.
      </p>
    </form>
  );
}
