// External Imports
import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Local Imports
import db from "@/lib/db/prisma";
import { MainNav } from "./main-nav";
import { StoreSwitcher } from "./store-switcher";

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
    <header className="sticky top-0 border-b bg-white shadow z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-12">
          <StoreSwitcher
            items={stores}
          />
        </div>

        <div className="flex items-center">
          <UserButton
            afterSignOutUrl="/"
          />
        </div>
      </div>

      <div className="container overflow-auto scrollable-element">
        <MainNav />
      </div>
    </header>
  );
};
