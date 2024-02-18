// Global Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { SizeForm } from "@/components/sizes/size-form";
import db from "@/lib/db/prisma";
import { ColorForm } from "@/components/colors/color-form";

interface Props {
  params: {
    colorId: string;
  };
};

const SizePage = async ({ params: { colorId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const color = await db.color.findUnique({
    where: {
      id: colorId,
    },
  });

  return (
    <main className="flex flex-col py-6">
      <div>
        <ColorForm
          initialData={color}
        />
      </div>
    </main>
  );
};

export default SizePage;