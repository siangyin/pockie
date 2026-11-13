import { RecurringForm } from "@/components/recurring/recurring-form";

export const metadata = {
  title: "Edit schedule",
};

export default async function EditRecurringPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RecurringForm scheduleId={id} />;
}
