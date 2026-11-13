import { EmptyState } from "@/components/layout/empty-state";

export const metadata = {
  title: "Budgets",
};

export default function BudgetsPage() {
  return (
    <div>
      <header className="mb-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Budgets</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Set a limit for the month, then see what&apos;s left in each category.
        </p>
      </header>
      <EmptyState
        title="No budgets yet"
        body="Budgets can be saved once your categories and accounts are ready."
      />
    </div>
  );
}
