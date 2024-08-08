"use client";

// External Imports
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { HTMLAttributes } from "react";

// Local Imports
import { cn } from "@/lib/utils/cn";
import { navbarLinks } from "@/lib/utils/navbarLinks";

export const MainNav = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = navbarLinks(params, pathname);

  return (
    <nav className={cn(
      "flex items-center gap-3 text-sm md:gap-5",
      className
    )}>
      {routes.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className={cn(
            "transition duration-200 py-2 px-1 hover:text-black",
            r.active ? "text-black font-bold border-b-2 border-black dark:text-white" : "text-neutral-500"
          )}
        >
          {r.label}
        </Link>
      ))}

      {/* FOR ADDING SPACE TO THE END OF THE NAVBAR IN MOBILE SCREENS */}
      {/* DO NOT REMOVE!!! */}
      <span className="invisible">a</span>
    </nav>
  );
};
