"use client";

// External Imports
import { Store } from "@prisma/client";
import { TbCreditCard, TbCurrencyDollar, TbPackage } from "react-icons/tb";

// Local Imports
import { moneyFormatter } from "@/lib/utils/money";
import { Heading } from "../shared/heading";
import { Separator } from "../ui/separator";
import { OverviewCard } from "./overview-card";
import { OverviewChart } from "./overview-chart";

interface Props {
  store: Store | null;
  salesDetails: {
    totalRevenue: number;
    sales: number;
    products: number;
  };
  chartRevenue: {
    name: string;
    total: number;
  }[];
};

export const OverviewContent = ({ store, salesDetails, chartRevenue }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={`Dashboard`}
          description={`Overview of ${store?.name}`}
        />
      </div>

      <Separator />

      <div className="flex flex-col gap-4 lg:gap-6">
        <div className="grid gap-4 md:grid-cols-3 lg:gap-6">
          <OverviewCard
            title="Total Revenue"
            icon={TbCurrencyDollar}
            content={moneyFormatter.format(salesDetails.totalRevenue)}
          />
          <OverviewCard
            title="Sales"
            icon={TbCreditCard}
            content={`+${salesDetails.sales}`}
          />
          <OverviewCard
            title="Products In Stock"
            icon={TbPackage}
            content={salesDetails.products}
          />
        </div>

        <OverviewChart
          title="Overview"
          chartRevenue={chartRevenue}
        />
      </div>
    </div>
  );
};
