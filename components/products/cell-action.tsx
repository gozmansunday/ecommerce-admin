"use client";

// Global Imports
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TbCopy, TbDots, TbEdit, TbTrash, TbX } from "react-icons/tb";

// Local Imports
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { errorToast, successToast } from "@/lib/db/toasts";
import { AlertModal } from "../modals/alert-modal";
import { Button } from "../ui/button";
import { ProductColumn } from "./products-column";

interface Props {
  data: ProductColumn;
};

export const CellAction = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  const [isDeletePending, startDeleteTransition] = useTransition();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    successToast("Product ID copied!", <TbX size={20} />);
  };

  // Delete Product
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/products/${data.id}`);
        router.refresh();
        successToast("Product deleted!", <TbX size={20} />);
        setDeleteModalOpen(false);
      } catch (error) {
        errorToast("Soemthing went wrong!", <TbX size={20} />);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
          >
            <span className="sr-only">Open Menu</span>
            <TbDots size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-40"
        >
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {/* Copy Product ID */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => onCopy(data.id)}
          >
            <TbCopy size={18} />
            <span>Copy ID</span>
          </DropdownMenuItem>

          {/* Edit Product */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => router.push(`/${params.storeId}/products/${data.id}`)}
          >
            <TbEdit size={18} />
            <span>Update</span>
          </DropdownMenuItem>

          {/* Delete ID */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => setDeleteModalOpen(true)}
          >
            <TbTrash size={18} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertModal
        title="Are you sure?"
        description="This action cannot be undone."
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onDelete}
        isPending={isDeletePending}
      />
    </>
  );
};
