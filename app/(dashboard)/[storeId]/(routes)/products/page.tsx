// Global Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { ProductsClient } from "@/components/products/products-client";
import { ProductColumn } from "@/components/products/products-column";
import db from "@/lib/db/prisma";
import { moneyFormatter } from "@/lib/utils/money";

interface Props {
  params: {
    storeId: string;
  };
};

const ProductsPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const products = await db.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: moneyFormatter.format(Number(item.price)),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <ProductsClient
          products={formattedProducts}
        />
      </div>
    </main>
  );
};

export default ProductsPage;