"use client";

// Global Imports
import { useEffect, useState } from "react";
import { TbLoader } from "react-icons/tb";

// Local Imports
import { Modal } from "../shared/modal";
import { Button } from "../ui/button";

interface Props {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
};

export const AlertModal = ({
  title,
  description,
  isOpen,
  onClose,
  onConfirm,
  isPending
}: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <section className="flex flex-col-reverse gap-2 mt-6 md:flex-row md:items-center md:justify-end">
        <Button
          variant={"outline"}
          onClick={onClose}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          variant={"destructive"}
          onClick={onConfirm}
          disabled={isPending}
        >
          {isPending ?
            <TbLoader
              size={24}
              className="animate-spin"
            /> :
            <span>Continue</span>}
        </Button>
      </section>
    </Modal>
  );
};
