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
import { SizeColumn } from "./sizes-column";

interface Props {
  data: SizeColumn;
};

export const CellAction = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  const [isDeletePending, startDeleteTransition] = useTransition();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    successToast("Size ID copied!", <TbX size={20} />);
  };

  // Delete Billboard
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/sizes/${data.id}`);
        router.refresh();
        successToast("Size deleted!", <TbX size={20} />);
        setDeleteModalOpen(false);
      } catch (error) {
        errorToast("Make sure all products using this size have been removed.", <TbX size={20} />);
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
          {/* Copy Size ID */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => onCopy(data.id)}
          >
            <TbCopy size={18} />
            <span>Copy ID</span>
          </DropdownMenuItem>

          {/* Edit Size */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => router.push(`/${params.storeId}/sizes/${data.id}`)}
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
