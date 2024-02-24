"use client";

// Global Imports
import { useParams, useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";

// Local Imports
import { ApiList } from "../shared/api-list";
import { DataTable } from "../shared/data-table";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ProductColumn, columns } from "./products-column";

interface Props {
  products: ProductColumn[];
};

export const ProductsClient = ({ products }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={`Products (${products.length})`}
          description="Manage products for your store"
        />

        {/* New products buttons for desktop and mobile */}
        <>
          <Button
            onClick={() => router.push(`/${params.storeId}/products/new`)}
            size={"default"}
            className="hidden flex-none gap-2 md:inline-flex"
          >
            <TbPlus size={20} />
            <span>Add New</span>
          </Button>
          <Button
            onClick={() => router.push(`/${params.storeId}/products/new`)}
            size={"icon"}
            className="flex-none gap-3 md:hidden"
          >
            <TbPlus size={20} />
          </Button>
        </>
      </div>

      <Separator />

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
      />

      <Heading
        title="API"
        description="API calls for products"
      />

      <Separator />

      <ApiList
        entityName="products"
        entityIdName="productId"
      />
    </div>
  );
};
