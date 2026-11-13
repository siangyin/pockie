import { AccountsProvider } from "@/components/accounts/accounts-provider";
import { AppShell } from "@/components/layout/app-shell";
import { TransactionsProvider } from "@/components/transactions/transactions-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountsProvider>
      <TransactionsProvider>
        <AppShell>{children}</AppShell>
      </TransactionsProvider>
    </AccountsProvider>
  );
}
