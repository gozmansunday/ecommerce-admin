// Global Imports
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
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
          card: "w-[36rem]",
        },
      }}
    >
      <html lang="en" className={cn("", GeistSans.className)}>
        <body className="">
          <ModalProvider />
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