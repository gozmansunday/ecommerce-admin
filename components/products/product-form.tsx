"use client";

// Global Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Color, Image, Product, Size } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { TbLoader, TbTrashFilled, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { errorToast, successToast } from "@/lib/db/toasts";
import { ProductSchema } from "@/models/zodSchemas";
import { AlertModal } from "../modals/alert-modal";
import { Heading } from "../shared/heading";
import { ImageUpload } from "../shared/image-upload";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

type ProductsFormType = z.infer<typeof ProductSchema>;

interface Props {
  initialData: Product & {
    images: Image[];
  } | null;
  categories: Category[];
  sizes: Size[];
  colors: Color[];
};

export const ProductForm = ({
  initialData,
  categories,
  sizes,
  colors,
}: Props) => {
  const router = useRouter();
  const params = useParams();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Handle pending states for 
  const [isCreatePending, startCreateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const title = initialData ? "Edit product" : "Create product";
  const description = initialData ? "Edit a product" : "Add a new product";
  const toastMessage = initialData ? "Product updated!" : "Product created!";
  const action = initialData ? "Save changes" : "Create";

  // Zod Form Validator
  const form = useForm<ProductsFormType>({
    resolver: zodResolver(ProductSchema),
    defaultValues: initialData ? {
      ...initialData,
      price: parseFloat(String(initialData?.price)),
    } : {
      name: "",
      images: [],
      price: 0,
      categoryId: "",
      sizeId: "",
      colorId: "",
      isArchived: false,
      isFeatured: false,
    },
  });

  // Create Product
  const onSubmit = async (values: ProductsFormType) => {
    console.log("submit");
    startCreateTransition(async () => {
      try {
        if (initialData) {
          await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
        } else {
          await axios.post(`/api/${params.storeId}/products`, values);
        }
        router.push(`/${params.storeId}/products`);
        router.refresh();
        successToast(toastMessage, <TbX size={20} />);
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
        console.log(error);
      }
    });
  };

  // Delete Product
  const onDelete = async () => {
    startDeleteTransition(async () => {
      try {
        await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
        router.push("/");
        successToast("Product deleted!", <TbX size={20} />);
      } catch (error) {
        errorToast("Something went wrong!", <TbX size={20} />);
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
          {/* Product Images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={isCreatePending}
                    value={field.value.map((image) => image.url)}
                    onChange={(url) => field.onChange([...field.value, { url }])}
                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:gap-x-6 md:gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Product Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter the name of the product"
                      disabled={isCreatePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter the price of the product"
                      disabled={isCreatePending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isCreatePending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Size */}
            <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    disabled={isCreatePending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                        >
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Color */}
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select
                    disabled={isCreatePending}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((c) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product isFeatured */}
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-lg border border-neutral-200 shadow-sm p-4 dark:border-neutral-800">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="flex flex-col gap-2 leading-none">
                    <FormLabel>Featured</FormLabel>
                    <FormDescription>
                      This product will appear on the home page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {/* Product isArchived */}
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 rounded-lg border border-neutral-200 shadow-sm p-4 dark:border-neutral-800">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-0.5"
                    />
                  </FormControl>
                  <div className="flex flex-col gap-2 leading-none">
                    <FormLabel>Archived</FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
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
