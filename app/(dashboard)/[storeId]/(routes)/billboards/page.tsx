// External Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { BillboardsClient } from "@/components/billboards/billboards-client";
import { BillboardColumn } from "@/components/billboards/billboards-column";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const BillboardsPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const billboards = await db.billboard.findMany({
    where: {
      storeId,
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <BillboardsClient
          billboards={formattedBillboards}
        />
      </div>
    </main>
  );
};

export default BillboardsPage;