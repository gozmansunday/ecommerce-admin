"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled } from "react-icons/tb";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { StoreSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { ApiAlert } from "../shared/api-alert";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type SettingsFormType = z.infer<typeof StoreSchema>;

interface Props {
  initialData: Store;
};

export const SettingsForm = ({ initialData }: Props) => {
  const router = useRouter();
  const params = useParams();

  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [isEditPending, startEditTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  // Zod Form Validator
  const form = useForm<SettingsFormType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  // Edit Store
  const onSubmit = async (values: SettingsFormType) => {
    startEditTransition(async () => {
      try {
        await axios.patch(`/api/stores/${params.storeId}`, values);
        router.refresh();
        toast.success("Store updated!");
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  };

  // Delete Store
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/stores/${params.storeId}`);
        router.push("/");
        toast.success("Store deleted!");
      } catch (error) {
        toast.error("Make sure all products and categories have been removed.");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title="Settings"
          description="Manage store preferences"
        />

        <Button
          onClick={() => setDeleteModalOpen(true)}
          disabled={isDeletePending}
          variant={"destructive"}
          size={"icon"}
          className="flex-none"
        >
          {isDeletePending ?
            <TbLoader
              size={20}
              className="animate-spin"
            /> :
            <TbTrashFilled size={20} />}
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 md:gap-10"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {/* Store Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the store"
                      disabled={isEditPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={isEditPending}
            className="flex-none self-end md:self-start"
          >
            {isEditPending ?
              <TbLoader
                size={24}
                className="animate-spin"
              /> :
              <span>Save changes</span>}
          </Button>
        </form>
      </Form>

      <Separator />

      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />

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
