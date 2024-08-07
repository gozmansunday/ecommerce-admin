// External Imports
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ReactNode } from "react";
import { Toaster } from "sonner";

// Local Imports
import { cn } from "@/lib/utils/cn";
import { ModalProvider } from "@/providers/modal-provider";
import "@/styles/globals.css";

// Metadata
export const metadata: Metadata = {
  title: "E-Commerce Admin Dashboard",
  description: "E-Commerce Admin Dashboard",
};

interface Props {
  children: ReactNode;
};

const RootLayout = ({ children }: Props) => {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        elements: {
          formButtonPrimary: "h-12 bg-neutral-500 text-sm normal-case hover:bg-neutral-600",
          card: "shadow-none w-[40rem] md:shadow-2xl md:w-auto md:min-w-[36rem]",
          userButtonPopoverCard: "shadow-xl w-full",
        },
      }}
    >
      <html lang="en" className={cn("", GeistSans.className)}>
        <body className="">
          <ModalProvider />
          <NextTopLoader
            showSpinner={false}
            height={3}
            crawlSpeed={500}
            speed={400}
            color="#000000"
          />
          <Toaster
            position="bottom-right"
            richColors={true}
            visibleToasts={3}
            duration={3000}
          />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;