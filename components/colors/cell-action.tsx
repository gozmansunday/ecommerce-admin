"use client";


// External Imports
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { TbCopy, TbDots, TbEdit, TbTrash } from "react-icons/tb";
import { toast } from "sonner";

// Local Imports
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertModal } from "../modals/alert-modal";
import { Button } from "../ui/button";
import { ColorColumn } from "./colors-column";

interface Props {
  data: ColorColumn;
};

export const CellAction = ({ data }: Props) => {
  const router = useRouter();
  const params = useParams();

  const [isDeletePending, startDeleteTransition] = useTransition();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("Color ID copied!");
  };

  // Delete Color
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
        router.refresh();
        toast.success("Color deleted!");
        setDeleteModalOpen(false);
      } catch (error) {
        toast.error("Make sure all products using this color have been removed.");
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
          {/* Copy Color ID */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => onCopy(data.id)}
          >
            <TbCopy size={18} />
            <span>Copy ID</span>
          </DropdownMenuItem>

          {/* Edit Color */}
          <DropdownMenuItem
            className="gap-2"
            onSelect={() => router.push(`/${params.storeId}/colors/${data.id}`)}
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
