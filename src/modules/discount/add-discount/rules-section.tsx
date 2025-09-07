import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CouponFormType } from "./utils";
import { useFormContext } from "react-hook-form";

interface RulesSectionProps {
  control: any;
}

const customerTypes = [
  { id: "NEW", label: "New Customers" },
  { id: "RETURNING", label: "Returning Customers" },
  { id: "VIP", label: "VIP Customers" },
];

const RulesSection: React.FC<RulesSectionProps> = ({ control }) => {
  const { watch, setValue } = useFormContext<CouponFormType>();

  const handleCustomerTypeChange = (
    checked: boolean | "indeterminate",
    value: "NEW" | "RETURNING" | "VIP"
  ) => {
    const currentTypes = watch("rules.customer_type") || [];

    if (checked) {
      setValue("rules.customer_type", [
        ...currentTypes.filter((type) => type !== value),
        value,
      ]);
    } else {
      setValue(
        "rules.customer_type",
        currentTypes.filter((type) => type !== value)
      );
    }
  };

  return (
    <>
      <div className="space-y-3">
        <FormLabel className="text-base">Customer Eligibility</FormLabel>
        <FormDescription>
          Select which customer types can use this coupon
        </FormDescription>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
          {customerTypes.map((type) => (
            <div
              key={type.id}
              className="flex items-center space-x-2 rounded-md border p-3 card-hover"
            >
              <Checkbox
                id={`customer-type-${type.id}`}
                checked={watch("rules.customer_type")?.includes(type.id as any)}
                onCheckedChange={(checked) =>
                  handleCustomerTypeChange(
                    checked,
                    type.id as "NEW" | "RETURNING" | "VIP"
                  )
                }
              />
              <Label
                htmlFor={`customer-type-${type.id}`}
                className="flex-1 cursor-pointer"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 mt-4">
        <FormField
          control={control}
          name="rules.first_purchase_only"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>First Purchase Only</FormLabel>
                <FormDescription>
                  Coupon can only be used on a customer&apos;s first purchase
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="rules.one_use_per_customer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>One Use Per Customer</FormLabel>
                <FormDescription>
                  Each customer can only use this coupon once
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default RulesSection;
