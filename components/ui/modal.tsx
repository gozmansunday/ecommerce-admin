"use client";

// Global Imports
import { ReactNode } from "react";

// Local Imports
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DrawerCloseButton } from "./drawer-close-button";

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export const Modal = ({
  title,
  description,
  isOpen,
  onClose,
  children
}: Props) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  if (isDesktop) return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <section>
          {children}
        </section>
      </DialogContent>
    </Dialog>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {title}
          </DrawerTitle>
          <DrawerDescription>
            {description}
          </DrawerDescription>
        </DrawerHeader>

        <section>
          {children}
        </section>

        {/* DO NOT REMOVE THE FOOTER EVEN IF IT IS EMPTY!!! */}
        <DrawerFooter />
      </DrawerContent>
    </Drawer>

  );
};
