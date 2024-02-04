// Libs
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

// Local Imports
import { cn } from "@/lib/utils/cn";
import "@/styles/globals.css";

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
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        elements: {
          formButtonPrimary: "h-12 bg-neutral-500 text-sm normal-case hover:bg-neutral-600",
          card: "w-[36rem]",
        },
      }}
    >
      <html lang="en" className={cn("", GeistSans.className)}>
        <body className="">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;