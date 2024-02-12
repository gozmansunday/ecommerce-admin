"use client";

// Global Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { errorToast, successToast } from "@/lib/db/toasts";
import { createBillboardSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type BillboardsFormType = z.infer<typeof createBillboardSchema>;

interface Props {
  initialData: Billboard | null;
};

export const BillboardForm = ({ initialData }: Props) => {
  const router = useRouter();
  const params = useParams();

  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated!" : "Billboard created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<BillboardsFormType>({
    resolver: zodResolver(createBillboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: ""
    },
  });

  // Create Billboard
  const onSubmit = async (values: BillboardsFormType) => {
    startCreateTransition(async () => {
      try {
        const billboard = await axios.patch(`/api/stores/${params.storeId}`, values);
        router.refresh();
        successToast(toastMessage, <TbX size={20} />);
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
      }
    });
  };

  // Delete Store
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/stores/${params.storeId}`);
        router.push("/");
        successToast("Store deleted!", <TbX size={20} />);
      } catch (error) {
        errorToast("Make sure all products and categories have been removed.", <TbX size={20} />);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 md:gap-6">
        <Heading
          title={title}
          description={description}
        />

        {initialData && (
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
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {/* Billboard Label */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the label of the new billboard"
                      disabled={isCreatePending}
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
            disabled={isCreatePending}
            className="flex-none self-end md:self-start"
          >
            {isCreatePending ?
              <TbLoader
                size={24}
                className="animate-spin"
              /> :
              <span>{action}</span>}
          </Button>
        </form>
      </Form>

      <Separator />

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
