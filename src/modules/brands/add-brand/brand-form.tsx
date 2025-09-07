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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Circle } from "lucide-react";
import Fullloader from "@/components/common/loader/fullloader";
import { Textarea } from "@/components/ui/textarea";
import {
  Brand,
  handleEditBrand,
  handleGetSingleBrand,
  handlePostBrand,
} from "@/app/actions/brands";
import MultiFileDropzone from "@/components/file-upload/Multifile-drop-zone";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  sequence: z
    .string()
    .optional()
    .transform((value) => (value ? parseInt(value, 10) : undefined))
    .refine((value) => !isNaN(value as number), {
      message: "Sequence must be a valid number.",
    }),
  status: z.string().min(2, { message: "Must Be Valid Status" }),
  medias: z.array(z.string()).optional(),
});

export function BrandForm({
  edit,
  id,
  setIsOpen,
}: {
  edit?: boolean;
  id?: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(!!edit);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "DEACTIVE",
    },
  });

  useEffect(() => {
    const loadData = async () => {
      if (edit && id) {
        try {
          setIsLoadingData(true);
          const result = await handleGetSingleBrand(id);
          if (result?.data) {
            form.reset({
              title: result?.data?.title,
              description: result?.data?.description,
              sequence: result?.data?.sequence,
              status: result?.data?.status,
            });
            setBrand(result?.data);
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
      };

      if (edit && id) {
        const result = await handleEditBrand({ body: payload, id });
        toast.success("Category updated successfully");
      } else {
        await handlePostBrand(payload);
        toast.success("Category created successfully");
      }

      setIsOpen(false);
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="sequence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sequence</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter sequence" {...field} />
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
        <MultiFileDropzone
          existingFiles={brand?.medias}
          name="medias"
          title="Medias"
          setValue={form.setValue}
          className="pb-6"
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <Circle className="animate-spin duration-300 ease-in-out transition-all" />
          ) : (
            <span>{edit ? "Update Brand" : "Create Brand"}</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
