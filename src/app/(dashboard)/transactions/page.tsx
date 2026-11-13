import { EmptyState } from "@/components/layout/empty-state";

export const metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return (
    <div>
      <header className="mb-2">
        <h1 className="text-2xl font-extrabold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Income, spending and transfers will show up here.
        </p>
      </header>
      <EmptyState
        title="No expenses yet"
        body="Add your first expense to see where your money goes."
        actionHref="/add"
        actionLabel="Add"
      />
    </div>
  );
}
