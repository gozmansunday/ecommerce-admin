"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader } from "react-icons/tb";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports
import { useStoreModal } from "@/hooks/useStoreModal";
import { StoreSchema } from "@/models/zodSchemas";
import { Modal } from "../shared/modal";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type StoreFormType = z.infer<typeof StoreSchema>;

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const [isPending, startTransition] = useTransition();

  // Zod Form Validator
  const form = useForm<StoreFormType>({
    resolver: zodResolver(StoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: StoreFormType) => {
    startTransition(async () => {
      try {
        const response = await axios.post("/api/stores", values);
        const store = response.data;

        toast.success("Store created!");
        window.location.assign(`/${store.id}`);
      } catch (error) {
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <Modal
      title="Create New Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <section className="flex flex-col-reverse gap-2 mt-6 md:flex-row md:items-center md:justify-end">
            <Button
              onClick={storeModal.onClose}
              disabled={isPending}
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending ?
                <TbLoader
                  size={24}
                  className="animate-spin"
                /> :
                <span>Continue</span>}
            </Button>
          </section>
        </form>
      </Form>
    </Modal>
  );
};
