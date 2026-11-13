import Link from "next/link";
import { ArrowLeftRight, Minus, Plus } from "lucide-react";

const choices = [
  {
    href: "/add/expense",
    title: "Expense",
    body: "Record money spent.",
    icon: Minus,
  },
  {
    href: "/add/income",
    title: "Income",
    body: "Record money received.",
    icon: Plus,
  },
  {
    href: "/add/transfer",
    title: "Transfer",
    body: "Move money between accounts.",
    icon: ArrowLeftRight,
  },
];

export const metadata = {
  title: "Add",
};

export default function AddPage() {
  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Add</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          What would you like to record?
        </p>
      </header>
      <ul className="grid gap-3">
        {choices.map((choice) => {
          const Icon = choice.icon;
          return (
            <li key={choice.href}>
              <Link
                href={choice.href}
                className="flex min-h-16 items-center gap-4 rounded-2xl bg-card px-4 py-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-gold text-ink">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span>
                  <span className="block font-bold">{choice.title}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {choice.body}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
