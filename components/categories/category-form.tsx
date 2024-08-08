"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Billboard, Category } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled } from "react-icons/tb";
import { toast } from "sonner";
import { z } from "zod";

// Local Imports
import { useOrigin } from "@/hooks/useOrigin";
import { CategorySchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

type CategoriesFormType = z.infer<typeof CategorySchema>;

interface Props {
  initialData: Category | null;
  billboards: Billboard[];
};

export const CategoryForm = ({ initialData, billboards }: Props) => {
  const router = useRouter();
  const params = useParams();

  // Get origin of the current website
  const origin = useOrigin();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle pending states for 
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit category" : "Create category";
  const description = initialData ? "Edit a category" : "Add a new category";
  const toastMessage = initialData ? "Category updated!" : "Category created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<CategoriesFormType>({
    resolver: zodResolver(CategorySchema),
    defaultValues: initialData || {
      name: "",
      billboardId: ""
    },
  });

  // Create Billboard
  const onSubmit = async (values: CategoriesFormType) => {
    startCreateTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/categories`, values);
        }
        router.push(`/${params.storeId}/categories`);
        router.refresh();
        toast.success(toastMessage);
      } catch (error) {
        toast.error("Something went wrong!");
        console.log(error);
      }
    });
  };

  // Delete Categories
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
        router.push("/");
        toast.success("Category deleted!");
      } catch (error) {
        toast.error("Make sure all products using this category have been removed.");
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
            {/* Category Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the category"
                      disabled={isCreatePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Billboard ID */}
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isCreatePending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a bilboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((b) => (
                        <SelectItem
                          key={b.id}
                          value={b.id}
                        >
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
