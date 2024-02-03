// Libs
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from 'geist/font/sans';
import { ReactNode } from "react";

// Local Imports
import "@/styles/globals.css";
import { cn } from "@/lib/utils/cn";

// Fonts
const inter = Inter({ subsets: ["latin"] });

// Metadata
export const metadata: Metadata = {
  title: "E-Commerce Admin Dashboard",
  description: "E-Commerce Admin Dashboard",
};

interface Props {
  children: ReactNode;
};

const RootLayout = ({ children }: Readonly<Props>) => {
  return (
    <html lang="en" className={cn("", GeistSans.className)}>
      <body className="">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;