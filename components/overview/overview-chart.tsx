"use client";

// Global Imports
import { BarChart } from "@tremor/react";

// Local Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moneyFormatter } from "@/lib/utils/money";

interface Props {
  title: string;
  chartRevenue: {
    name: string;
    total: number;
  }[];
};

const dataFormatter = (number: number) => `$${Intl.NumberFormat('us').format(number).toString()}`;

export const OverviewChart = ({ title, chartRevenue }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4 w-full">
          <span className="text-2xl font-bold md:text-3xl">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          className="h-64 md:h-96"
          data={chartRevenue}
          index="name"
          categories={["total"]}
          valueFormatter={dataFormatter}
          yAxisWidth={56}
        />
      </CardContent>
    </Card>
  );
};
