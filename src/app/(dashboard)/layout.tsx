import { AccountsProvider } from "@/components/accounts/accounts-provider";
import { BudgetsProvider } from "@/components/budgets/budgets-provider";
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
        <BudgetsProvider>
          <AppShell>{children}</AppShell>
        </BudgetsProvider>
      </TransactionsProvider>
    </AccountsProvider>
  );
}
