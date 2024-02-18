// Global Imports
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { redirect } from "next/navigation";

// Local Imports
import { ColorsClient } from "@/components/colors/colors-client";
import { ColorColumn } from "@/components/colors/colors-column";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const ColorsPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const colors = await db.color.findMany({
    where: {
      storeId,
    },
  });

  const formattedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <main className="flex flex-col py-6">
      <div>
        <ColorsClient
          colors={formattedColors}
        />
      </div>
    </main>
  );
};

export default ColorsPage;