import React, { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  handleCancelOrder,
  handleChangeOrderStatus,
} from "@/app/actions/orders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import LoaderComponent from "@/components/ui/loader";
import { Input } from "@/components/ui/input";

const FormSchema = z.object({
  reason: z.string().min(2, { message: "Must Be Valid" }),
});

const CancelForm = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      reason: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      const result = await handleCancelOrder({ id, body: data });
      // console.log(result);
      if (result?.success) {
        toast("Order has been cancelled");
        setTimeout(() => window.location.reload(), 100);
      } else {
        toast(result?.message ?? "Something Went Wrong");
      }
    } catch (error) {
      toast("Something Went Wrong");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason</FormLabel>
              <FormControl>
                <Input placeholder="Cancel Reason" {...field} />
              </FormControl>
              <FormDescription>
                Are you sure to cancel order? Tell us the reason.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? <LoaderComponent /> : <span>Submit</span>}
        </Button>
      </form>
    </Form>
  );
};

export default CancelForm;
