import Link from "next/link";
import { AccountSelect, AccountsSaveNote } from "@/components/accounts/account-select";
import { Button } from "@/components/ui/button";
import { DateField } from "@/components/forms/date-field";

export const metadata = {
  title: "Transfer",
};

const fieldClassName =
  "h-12 w-full rounded-xl border border-input bg-card px-3 text-base font-medium";

export default function AddTransferPage() {
  return (
    <div>
      <Link
        href="/add"
        className="text-sm font-bold text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring"
      >
        Back
      </Link>
      <header className="mt-3 mb-5">
        <h1 className="text-2xl font-extrabold tracking-tight">Transfer</h1>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Moving money between your accounts does not count as income or spending.
        </p>
      </header>
      <form className="grid gap-4" aria-describedby="save-note">
        <label htmlFor="amount" className="grid gap-1.5 text-sm font-semibold">
          Amount
          <input
            id="amount"
            name="amount"
            inputMode="decimal"
            placeholder="0.00"
            required
            className={fieldClassName}
          />
        </label>
        <AccountSelect id="from-account" label="From" />
        <AccountSelect id="to-account" label="To" />
        <DateField id="date" label="Date" />
        <Button type="button" disabled className="h-12 w-full text-base">
          Save transfer
        </Button>
        <AccountsSaveNote kind="transfer" />
      </form>
    </div>
  );
}
