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
import { BillboardColumn, columns } from "./billboards-column";

interface Props {
  billboards: BillboardColumn[];
};

export const BillboardsClient = ({ billboards }: Props) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={`Billboards (${billboards.length})`}
          description="Manage billboards for your store"
        />

        {/* New billboard buttons for desktop and mobile */}
        <>
          <Button
            onClick={() => router.push(`/${params.storeId}/billboards/new`)}
            size={"default"}
            className="hidden flex-none gap-2 md:inline-flex"
          >
            <TbPlus size={20} />
            <span>Add New</span>
          </Button>
          <Button
            onClick={() => router.push(`/${params.storeId}/billboards/new`)}
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
        data={billboards}
        searchKey="label"
      />

      <Heading
        title="API"
        description="API calls for billboards"
      />

      <Separator />

      <ApiList
        entityName="billboards"
        entityIdName="billboardId"
      />
    </div>
  );
};
