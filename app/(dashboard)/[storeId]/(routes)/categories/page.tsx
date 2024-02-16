// Global Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { BillboardsClient } from "@/components/billboards/billboards-client";
import { CategoryColumn } from "@/components/categories/categories-column";
import db from "@/lib/db/prisma";
import { CategoriesClient } from "@/components/categories/categories-client";

interface Props {
  params: {
    storeId: string;
  };
};

const CategoriesPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const categories = await db.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <CategoriesClient
          categories={formattedCategories}
        />
      </div>
    </main>
  );
};

export default CategoriesPage;