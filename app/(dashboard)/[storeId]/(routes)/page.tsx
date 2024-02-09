import db from "@/lib/db/prisma";

interface Props {
  params: {
    storeId: string;
  };
};

const DashboardPage = async ({ params: { storeId } }: Props) => {
  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return (
    <div className="text-3xl py-6 font-bold">
      {store?.name}
    </div>
  );
};

export default DashboardPage;