// Global Imports
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// Local Imports
import db from "@/lib/db/prisma";
import { Navbar } from "@/components/header/navbar";

interface Props {
  children: ReactNode;
  params: {
    storeId: string;
  };
};

const DashboardLayout = async ({ children, params: { storeId } }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await db.store.findFirst({
    where: {
      id: storeId,
      userId: userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <div className="">
      <Navbar />
      {children}
    </div>
  );
};

export default DashboardLayout;