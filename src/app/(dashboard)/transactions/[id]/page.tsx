import { TransactionEditor } from "@/components/transactions/transaction-editor";

export const metadata = {
  title: "Edit transaction",
};

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TransactionEditor transactionId={id} />;
}
