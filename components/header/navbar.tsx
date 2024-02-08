// Global Imports
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";
import db from "@/lib/db/prisma";

export const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await db.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <StoreSwitcher
            items={stores}
          />
          <MainNav className="" />
        </div>

        <div className="flex items-center">
          <UserButton
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </header>
  );
};
