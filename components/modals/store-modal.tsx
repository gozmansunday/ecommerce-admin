"use client";

// Global Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { useStoreModal } from "@/hooks/useStoreModal";
import { createStoreSchema } from "@/models/zodSchemas";
import { Modal } from "../ui/modal";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const StoreModal = () => {
  const storeModal = useStoreModal();

  // Zod Form Validator
  const form = useForm<z.infer<typeof createStoreSchema>>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createStoreSchema>) => {
    console.log(values);
    // TODO: Create new store
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
                    disabled={form.formState.isSubmitting}
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
              variant={"outline"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              Continue
            </Button>
          </section>
        </form>
      </Form>
    </Modal>
  );
};
