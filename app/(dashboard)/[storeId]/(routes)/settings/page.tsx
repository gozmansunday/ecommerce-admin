// External Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { SettingsForm } from "@/components/settings/settings-form";
import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const SettingsPage = async ({ params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      userId: userId,
      id: storeId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <main className="flex flex-col py-6">
      <div>
        <SettingsForm
          initialData={store}
        />
      </div>
    </main>
  );
};

export default SettingsPage;