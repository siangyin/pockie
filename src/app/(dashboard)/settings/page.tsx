import Link from "next/link";

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Accounts, categories, and your data stay on this device.
        </p>
      </header>
      <ul className="grid gap-3">
        <li>
          <Link
            href="/settings/accounts"
            className="block rounded-2xl bg-card p-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <h2 className="font-semibold">Accounts</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cash, bank accounts, credit cards and e-wallets.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/settings/recurring"
            className="block rounded-2xl bg-card p-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <h2 className="font-semibold">Recurring</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Regular income and bills, added on the due date.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/settings/categories"
            className="block rounded-2xl bg-card p-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <h2 className="font-semibold">Categories</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Groups for spending and income. Add your own, or rename the ones you have.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/settings/data"
            className="block rounded-2xl bg-card p-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <h2 className="font-semibold">Import / Export</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Bring in a CSV, or take your transactions and budgets with you.
            </p>
          </Link>
        </li>
        <li>
          <Link
            href="/settings/preferences"
            className="block rounded-2xl bg-card p-4 ring-1 ring-border focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
          >
            <h2 className="font-semibold">Preferences</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Singapore dollars, and dates in Asia/Singapore.
            </p>
          </Link>
        </li>
      </ul>
    </div>
  );
}
