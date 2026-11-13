import { ReconcileAccount } from "@/components/accounts/reconcile-account";

export const metadata = {
  title: "Reconcile",
};

export default async function ReconcileAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReconcileAccount accountId={id} />;
}
