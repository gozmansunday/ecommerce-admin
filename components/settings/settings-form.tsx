"use client";

// Global Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Store } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { deleteStoreFxn, editStoreFxn } from "@/lib/actions/storeActions";
import { errorToast, successToast } from "@/lib/db/toasts";
import { editStoreSchema } from "@/models/zodSchemas";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Heading } from "../ui/heading";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

interface Props {
  initialData: Store;
  storeId: string;
};

export const SettingsForm = ({ initialData, storeId }: Props) => {
  const router = useRouter();

  const [isEditPending, startEditTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  // Zod Form Validator
  const form = useForm<z.infer<typeof editStoreSchema>>({
    resolver: zodResolver(editStoreSchema),
    defaultValues: {
      name: initialData.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof editStoreSchema>) => {
    startEditTransition(async () => {
      try {
        await editStoreFxn(values, storeId);

        router.refresh();
        successToast("Store updated!", <TbX size={20} />);
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
      }
    });
  };

  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await deleteStoreFxn(storeId);

        successToast("Store deleted!", <TbX size={20} />);
        router.refresh();
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage store preferences"
        />

        <Button
          variant={"destructive"}
          size={"icon"}
          className="flex-none"
        >
          <TbTrashFilled size={20} />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
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
                      placeholder="Enter the name of the new store"
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
    </>
  );
};