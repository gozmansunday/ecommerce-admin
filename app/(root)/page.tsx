"use client";

// Global Imports
import { useEffect } from "react";

// Local Imports
import { useStoreModal } from "@/hooks/useStoreModal";

const SetupPage = () => {
  const { isOpen, onOpen, onClose } = useStoreModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div>
      Root Page
    </div>
  );
};

export default SetupPage;