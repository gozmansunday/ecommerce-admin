// Global Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { SizesClient } from "@/components/sizes/sizes-client";
import { SizeColumn } from "@/components/sizes/sizes-column";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const SizesPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const sizes = await db.size.findMany({
    where: {
      storeId,
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <SizesClient
          sizes={formattedSizes}
        />
      </div>
    </main>
  );
};

export default SizesPage;