import { AccountForm } from "@/components/accounts/account-form";

export const metadata = {
  title: "Edit account",
};

export default async function EditAccountPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <AccountForm accountId={id} />;
}
