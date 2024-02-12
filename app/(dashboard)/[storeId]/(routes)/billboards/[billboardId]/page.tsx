// Global Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import db from "@/lib/db/prisma";
import { BillboardForm } from "@/components/billboards/billboard-form";

interface Props {
  params: {
    billboardId: string;
  };
};

const BillboardPage = async ({ params: { billboardId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const billboard = await db.billboard.findUnique({
    where: {
      id: billboardId,
    },
  });

  return (
    <main className="flex flex-col py-6">
      <div>
        <BillboardForm
          initialData={billboard}
        />
      </div>
    </main>
  );
};

export default BillboardPage;