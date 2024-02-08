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
    <div className="container text-3xl py-4 font-bold">
      {store?.name}
    </div>
  );
};

export default DashboardPage;