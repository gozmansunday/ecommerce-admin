// Global Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { ProductForm } from "@/components/products/product-form";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    productId: string;
    storeId: string;
  };
};

const ProductPage = async ({ params: { productId, storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany({
    where: {
      storeId
    },
  });

  const sizes = await db.size.findMany({
    where: {
      storeId
    },
  });

  const colors = await db.color.findMany({
    where: {
      storeId
    },
  });

  return (
    <main className="flex flex-col py-6">
      <div>
        <ProductForm
          initialData={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </main>
  );
};

export default ProductPage;