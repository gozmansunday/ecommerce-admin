"use client";

// Global Imports
import { HTMLAttributes } from "react";
import { useParams, usePathname } from "next/navigation";

// Local Imports
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export const MainNav = ({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn(
      "hidden items-center gap-3 md:flex md:gap-5",
      className
    )}>
      {routes.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className={cn(
            "transition duration-200 hover:text-black",
            r.active ? "text-black dark:text-white" : "text-neutral-400 dark:text-neutral-600"
          )}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  );
};
