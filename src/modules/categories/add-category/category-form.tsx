"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Category,
  handleEditCategory,
  handleGetSingleCategory,
  handlePostCategory,
} from "@/app/actions/categories";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Circle } from "lucide-react";
import Fullloader from "@/components/common/loader/fullloader";
import { Textarea } from "@/components/ui/textarea";
import MultiFileDropzone from "@/components/file-upload/Multifile-drop-zone";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  status: z.string().min(2, { message: "Must Be Valid Status" }),
  medias: z.array(z.string()).optional(),
  featured: z.string().optional(),
  // parent: z.string().optional(),

  sequence: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === undefined || val === "" ? undefined : Number(val)
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Sequence must be a valid number.",
    }),

  featured_sequence: z
    .union([z.string(), z.number()])
    .optional()
    .transform((val) =>
      val === undefined || val === "" ? undefined : Number(val)
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: "Sequence must be a valid number.",
    }),
});

export function CategoryForm({
  edit,
  id,
  setIsOpen,
  // categories,
}: {
  edit?: boolean;
  id?: string;
  setIsOpen: (isOpen: boolean) => void;
  // categories: Category[];
}) {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(!!edit);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "DEACTIVE",
      featured: "false",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (edit && id) {
        try {
          setIsLoadingData(true);
          const result = await handleGetSingleCategory(id);
          if (result?.data) {
            form.reset({
              title: result?.data?.title,
              description: result?.data?.description,
              sequence: result?.data?.sequence,
              status: result?.data?.status,
              featured: result?.data?.featured ? "true" : "false",
              featured_sequence: result?.data?.featured_sequence,
              // parent: result?.data?.parent?.id,
            });
            setCategory(result.data);
          }
        } catch (error) {
          toast.error("Failed to load category data");
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    loadData();
  }, [edit, id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);
    try {
      // Ensure sequence is a number
      const payload = {
        ...values,
        sequence: values.sequence ? Number(values.sequence) : undefined,
        featured: values?.featured === "true" ? true : false,
        featured_sequence: values?.featured_sequence
          ? Number(values.featured_sequence)
          : undefined,
      };

      // Handle parent field
      // if (
      //   values.parent === undefined ||
      //   values.parent === "none" ||
      //   values.parent === ""
      // ) {
      //   // Exclude parent from payload
      //   delete payload.parent;
      // } else if (values.parent && values.parent.startsWith("category:")) {
      //   // Remove "category:" prefix
      //   payload.parent = values.parent.replace("category:", "");
      // }
      console.log("Values", payload);

      if (edit && id) {
        const result = await handleEditCategory({ body: payload, id });
        // console.log("edit res", result);
        toast.success("Category updated successfully");
      } else {
        await handlePostCategory(payload);
        toast.success("Category created successfully");
      }
      setTimeout(() => window.location.reload(), 100);
      setIsOpen(false);
    } catch (error) {
      // console.log("category Error", JSON.stringify(error));
      toast.error("Operation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoadingData) {
    return (
      <div className="size-full flex items-center justify-center">
        <Circle className="animate-spin duration-300 ease-in-out transition-all" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {categories
                    ?.filter((cat) => !edit || cat.id !== category?.id) // exclude self if editing
                    .map((i, idx) => (
                      <SelectItem key={idx} value={i.id}>
                        {i.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description for category"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-x-2">
          <FormField
            control={form.control}
            name="sequence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sequence</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter sequence"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DEACTIVE">Deactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-2">
          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Is Featured?" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="featured_sequence"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Sequence</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter Featured sequence"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <MultiFileDropzone
          existingFiles={category?.medias}
          name="medias"
          title="Medias"
          setValue={form.setValue}
          className="pb-6"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Circle className="animate-spin duration-300 ease-in-out transition-all" />
          ) : (
            <span>{edit ? "Update Category" : "Create Category"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
