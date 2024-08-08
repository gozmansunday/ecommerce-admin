"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Color } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled } from "react-icons/tb";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { ColorSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type ColorsFormType = z.infer<typeof ColorSchema>;

interface Props {
  initialData: Color | null;
};

export const ColorForm = ({ initialData }: Props) => {
  const router = useRouter();
  const params = useParams();

  // Get origin of the current website
  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle pending states for 
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit color" : "Create color";
  const description = initialData ? "Edit a color" : "Add a new color";
  const toastMessage = initialData ? "Color updated!" : "Color created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<ColorsFormType>({
    resolver: zodResolver(ColorSchema),
    defaultValues: initialData || {
      name: "",
      value: ""
    },
  });

  // Create Color
  const onSubmit = async (values: ColorsFormType) => {
    startCreateTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/colors`, values);
        }
        router.push(`/${params.storeId}/colors`);
        router.refresh();
        toast.success(toastMessage);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    });
  };

  // Delete Color
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
        router.push("/");
        toast.success("Color deleted!");
      } catch (error) {
        toast.error("Make sure all products using this color have been removed.");
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
          <div className="grid gap-6 md:gap-x-6 md:gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Color Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the color"
                      disabled={isCreatePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Color Value */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center gap-4">
                      <Input
                        type="text"
                        placeholder="Enter the value of the color"
                        disabled={isCreatePending}
                        className="pr-12"
                        {...field}
                      />
                      <div className="absolute flex items-center justify-center right-2 top-2 bottom-2">
                        <div
                          className="p-4 border rounded-full"
                          style={{
                            backgroundColor: field.value
                          }}
                        />
                      </div>
                    </div>
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
