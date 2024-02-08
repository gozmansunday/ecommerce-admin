import { UserButton } from "@clerk/nextjs";
import { MainNav } from "./main-nav";

export const Navbar = () => {
  return (
    <header className="border-b">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <div>
            Store Switcher
          </div>
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
