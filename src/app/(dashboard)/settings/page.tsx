import Link from "next/link";

const sections = [
  {
    title: "Categories",
    body: "Groups for income and spending. You can rename them later.",
  },
  {
    title: "Recurring",
    body: "Regular income and bills, so you don't enter them every time.",
  },
  {
    title: "Import / Export",
    body: "Bring in a CSV, or take your transactions with you.",
  },
  {
    title: "Preferences",
    body: "Singapore dollars, and dates in Asia/Singapore.",
  },
];

export const metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div>
      <header className="mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Start with your accounts. Categories and the rest follow.
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
        {sections.map((section) => (
          <li key={section.title} className="rounded-2xl bg-card p-4 ring-1 ring-border">
            <h2 className="font-semibold">{section.title}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{section.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
