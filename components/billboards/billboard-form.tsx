"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled } from "react-icons/tb";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { BillboardSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type BillboardsFormType = z.infer<typeof BillboardSchema>;

interface Props {
  initialData: Billboard | null;
};

export const BillboardForm = ({ initialData }: Props) => {
  const router = useRouter();
  const params = useParams();

  // Get origin of the current website
  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle pending states for 
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit billboard" : "Create billboard";
  const description = initialData ? "Edit a billboard" : "Add a new billboard";
  const toastMessage = initialData ? "Billboard updated!" : "Billboard created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<BillboardsFormType>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData || {
      label: "",
      imageUrl: ""
    },
  });

  // Create Billboard
  const onSubmit = async (values: BillboardsFormType) => {
    startCreateTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/billboards`, values);
        }
        router.push(`/${params.storeId}/billboards`);
        router.refresh();
        toast.success(toastMessage);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    });
  };

  // Delete Billboard
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
        router.push("/");
        toast.success("Billboard deleted!");
      } catch (error) {
        toast.error("Make sure all categories using this billboard have been removed.");
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
          className="flex flex-col gap-6 md:gap-10"
        >
          {/* Billboard Image */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isCreatePending}
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:gap-x-6 md:gap-y-10 md:grid-cols-2 lg:grid-cols-3">
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
                      placeholder="Enter the label of the billboard"
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
