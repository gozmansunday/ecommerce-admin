"use client";

// Global Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { errorToast, successToast } from "@/lib/db/toasts";
import { SizeSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type SizesFormType = z.infer<typeof SizeSchema>;

interface Props {
  initialData: Size | null;
};

export const SizeForm = ({ initialData }: Props) => {
  const router = useRouter();
  const params = useParams();

  // Get origin of the current website
  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle pending states for 
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit size" : "Create size";
  const description = initialData ? "Edit a size" : "Add a new size";
  const toastMessage = initialData ? "Size updated!" : "Size created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<SizesFormType>({
    resolver: zodResolver(SizeSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    },
  });

  // Create Size
  const onSubmit = async (values: SizesFormType) => {
    startCreateTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/sizes`, values);
        }
        router.push(`/${params.storeId}/sizes`);
        router.refresh();
        successToast(toastMessage, <TbX size={20} />);
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
        console.log(error);
      }
    });
  };

  // Delete Size
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
        router.push("/");
        successToast("Size deleted!", <TbX size={20} />);
      } catch (error) {
        errorToast("Make sure all products using this size have been removed.", <TbX size={20} />);
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Size Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the new size"
                      disabled={isCreatePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Size Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the value of the new size"
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
