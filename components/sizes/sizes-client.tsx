"use client";

// External Imports
import { useParams, useRouter } from "next/navigation";
import { TbPlus } from "react-icons/tb";

// Local Imports
import { ApiList } from "../shared/api-list";
import { DataTable } from "../shared/data-table";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SizeColumn, columns } from "./sizes-column";

interface Props {
  sizes: SizeColumn[];
};

export const SizesClient = ({ sizes }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={`Sizes (${sizes.length})`}
          description="Manage sizes for your store"
        />

        {/* New size buttons for desktop and mobile */}
        <>
          <Button
            onClick={() => router.push(`/${params.storeId}/sizes/new`)}
            size={"default"}
            className="hidden flex-none gap-2 md:inline-flex"
          >
            <TbPlus size={20} />
            <span>Add New</span>
          </Button>
          <Button
            onClick={() => router.push(`/${params.storeId}/sizes/new`)}
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
        data={sizes}
        searchKey="name"
      />

      <Heading
        title="API"
        description="API calls for sizes"
      />

      <Separator />

      <ApiList
        entityName="sizes"
        entityIdName="sizeId"
      />
    </div>
  );
};
