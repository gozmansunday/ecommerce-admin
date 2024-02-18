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
import { ColorColumn, columns } from "./colors-column";

interface Props {
  colors: ColorColumn[];
};

export const ColorsClient = ({ colors }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={`Colors (${colors.length})`}
          description="Manage colors for your store"
        />

        {/* New color buttons for desktop and mobile */}
        <>
          <Button
            onClick={() => router.push(`/${params.storeId}/colors/new`)}
            size={"default"}
            className="hidden flex-none gap-2 md:inline-flex"
          >
            <TbPlus size={20} />
            <span>Add New</span>
          </Button>
          <Button
            onClick={() => router.push(`/${params.storeId}/colors/new`)}
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
        data={colors}
        searchKey="name"
      />

      <Heading
        title="API"
        description="API calls for colors"
      />

      <Separator />

      <ApiList
        entityName="colors"
        entityIdName="colorId"
      />
    </div>
  );
};
