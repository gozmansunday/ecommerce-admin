// External Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { getChartData } from "@/actions/get-chart-data";
import { getSalesDetails } from "@/actions/get-sales-details";
import { OverviewContent } from "@/components/overview/overview-content";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const DashboardPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  const salesDetails = await getSalesDetails(storeId);
  const chartRevenue = await getChartData(storeId);

  return (
    <main className="flex flex-col py-6">
      <OverviewContent
        store={store}
        salesDetails={salesDetails}
        chartRevenue={chartRevenue}
      />
    </main>
  );
};

export default DashboardPage;