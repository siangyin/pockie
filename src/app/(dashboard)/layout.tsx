import { AccountsProvider } from "@/components/accounts/accounts-provider";
import { BudgetsProvider } from "@/components/budgets/budgets-provider";
import { AppShell } from "@/components/layout/app-shell";
import { RecurringProvider } from "@/components/recurring/recurring-provider";
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
          <RecurringProvider>
            <AppShell>{children}</AppShell>
          </RecurringProvider>
        </BudgetsProvider>
      </TransactionsProvider>
    </AccountsProvider>
  );
}
