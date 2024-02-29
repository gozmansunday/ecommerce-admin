"use client";

// Local Imports
import { DataTable } from "../shared/data-table";
import { Heading } from "../shared/heading";
import { Separator } from "../ui/separator";
import { OrderColumn, columns } from "./orders-column";

interface Props {
  orders: OrderColumn[];
};

export const OrdersClient = ({ orders }: Props) => {
  return (
    <div>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage orders for your store"
      />

      <Separator />

      <DataTable
        columns={columns}
        data={orders}
        searchKey="products"
      />
    </div>
  );
};
