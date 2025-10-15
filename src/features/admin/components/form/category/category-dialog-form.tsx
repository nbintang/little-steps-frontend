import { useEffect } from "react";
import { useDisplayCategoryDialog } from "../../../hooks/use-display-category-dialog";
import { useShallow } from "zustand/shallow";
import { DialogLayout } from "@/components/dialog-layout";
import { useForm } from "react-hook-form";
import {
  categorySchema,
  CategorySchema,
} from "../../../schemas/category-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePost } from "@/hooks/use-post";
import { CategoryAPI } from "@/types/category";
import { usePatch } from "@/hooks/use-patch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/lib/enums/category-type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CategoryDialogForm = () => {
  const { isOpen, data, mode, close } = useDisplayCategoryDialog(
    useShallow((state) => ({
      isOpen: state.isOpen,
      data: state.data,
      mode: state.mode,
      close: state.close,
    }))
  );
  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      id: data?.id || "",
      name: data?.name || "",
      type: data?.type as CategoryType,
    },
  });
  const id = form.watch("id") || data?.id;
  const { mutate: updateCategory } = usePatch<CategoryAPI, { name: string }>({
    keys: ["categories"],
  });

  const { mutate: createCategory } = usePost<CategoryAPI, { name: string }>({
    keys: ["categories"],
    endpoint: "categories",
  });

  useEffect(() => {
    if (data) {
      form.reset({
        id: data.id || "",
        name: data.name || "",
        type: data.type as CategoryType,
      });
    }
  }, [isOpen, data, form]);
  useEffect(() => {
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  const onSubmit = async (formData: CategorySchema) => {
    const { name, type } = formData;
    try {
      if (mode === "edit") {
        const realId = data?.id || form.getValues("id");
        if (!realId) throw new Error("Missing category id");
        await updateCategory({
          payload: { name: name || "" },
          endpoint: `categories/${realId}`,
        });
      }

      if (mode === "create") {
        await createCategory({ name: name || "" });
      }

      close();
      form.reset();
    } catch (err: any) {
      console.error("Failed to save category:", err);
    }
  };
  return (
    <DialogLayout
      isOpen={isOpen}
      onOpenChange={close}
      title={mode === "edit" ? "Edit Category" : "Create Category"}
      description="Manage your categorys"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Input
                    placeholder="Category Name"
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel />
                <FormControl>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PARENT">Parent</SelectItem>
                      <SelectItem value="CHILD">Children</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </DialogLayout>
  );
};
