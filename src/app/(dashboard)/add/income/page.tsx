import Link from "next/link";
import { EntryForm } from "@/components/transactions/entry-form";

export const metadata = {
  title: "Add income",
};

export default function AddIncomePage() {
  return (
    <div>
      <Link
        href="/add"
        className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Back
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Add income</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Record money you&apos;ve received.
        </p>
      </header>
      <EntryForm kind="income" />
    </div>
  );
}
