// External Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { CategoryForm } from "@/components/categories/category-form";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    categoryId: string;
    storeId: string;
  };
};

const CategoryPage = async ({ params: { categoryId, storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const category = await db.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <main className="flex flex-col py-6">
      <div>
        <CategoryForm
          initialData={category}
          billboards={billboards}
        />
      </div>
    </main>
  );
};

export default CategoryPage;