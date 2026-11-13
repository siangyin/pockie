import { AccountsProvider } from "@/components/accounts/accounts-provider";
import { AppShell } from "@/components/layout/app-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountsProvider>
      <AppShell>{children}</AppShell>
    </AccountsProvider>
  );
}
