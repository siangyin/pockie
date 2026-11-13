import Link from "next/link";
import { CurrentMonth } from "@/components/layout/current-month";
import { EmptyState } from "@/components/layout/empty-state";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Pockie</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track simply. Spend wisely. Save happily.
          </p>
        </div>
        <CurrentMonth />
      </header>

      <section className="rounded-3xl bg-ink px-5 py-6 text-white">
        <h2 className="text-sm font-semibold">Money remaining</h2>
        <p className="mt-2 text-4xl font-extrabold tracking-tight">—</p>
        <p className="mt-2 text-sm leading-6 text-white/90">
          Income minus spending. Add a few transactions to see what&apos;s left
          this month.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Monthly spending
          </h2>
          <p className="mt-2 text-2xl font-extrabold">—</p>
        </article>
        <article className="rounded-2xl bg-card p-4 ring-1 ring-border">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Monthly income
          </h2>
          <p className="mt-2 text-2xl font-extrabold">—</p>
        </article>
      </div>

      <section className="rounded-2xl bg-card p-4 ring-1 ring-border">
        <h2 className="font-semibold">Budget</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          No budgets yet. A monthly limit shows whether you&apos;re on track.
        </p>
        <Link
          href="/budgets"
          className="mt-3 inline-flex text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
        >
          View budgets
        </Link>
      </section>

      <section>
        <h2 className="font-semibold">Recent transactions</h2>
        <EmptyState
          title="No expenses yet"
          body="Add your first expense to see where your money goes."
          actionHref="/add"
          actionLabel="Add"
        />
      </section>
    </div>
  );
}
