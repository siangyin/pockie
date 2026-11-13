import Link from "next/link";
import { TransferForm } from "@/components/transactions/transfer-form";

export const metadata = {
  title: "Transfer",
};

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
      <TransferForm />
    </div>
  );
}
