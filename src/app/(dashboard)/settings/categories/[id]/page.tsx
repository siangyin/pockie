import { CategoryForm } from "@/components/categories/category-form";

export const metadata = {
  title: "Edit category",
};

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CategoryForm categoryId={id} />;
}
