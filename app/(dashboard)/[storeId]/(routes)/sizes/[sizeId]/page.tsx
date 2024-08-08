// External Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { SizeForm } from "@/components/sizes/size-form";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    sizeId: string;
  };
};

const SizePage = async ({ params: { sizeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const size = await db.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  return (
    <main className="flex flex-col py-6">
      <div>
        <SizeForm
          initialData={size}
        />
      </div>
    </main>
  );
};

export default SizePage;