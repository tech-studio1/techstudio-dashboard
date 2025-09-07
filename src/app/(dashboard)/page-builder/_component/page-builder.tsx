"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  GripVertical,
  Layers,
  LayoutGrid,
  Image,
  Tag,
  Info,
} from "lucide-react";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

// Define container types
const CONTAINER_TYPES = [
  {
    value: "PRODUCT",
    label: "Products",
    icon: <LayoutGrid className="mr-2 h-4 w-4" />,
  },
  {
    value: "BANNER",
    label: "Banners",
    icon: <Image className="mr-2 h-4 w-4" />,
  },
  {
    value: "CATEGORY",
    label: "Categories",
    icon: <Tag className="mr-2 h-4 w-4" />,
  },
  {
    value: "FEATURED",
    label: "Featured",
    icon: <Layers className="mr-2 h-4 w-4" />,
  },
  { value: "CUSTOM", label: "Custom", icon: <Plus className="mr-2 h-4 w-4" /> },
];

// Layout options
const LAYOUT_OPTIONS = [
  { value: "grid", label: "Grid" },
  { value: "carousel", label: "Carousel" },
  { value: "list", label: "List" },
  { value: "featured", label: "Featured" },
];

// Container schema for validation
const containerFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  container_type: z.enum([
    "PRODUCT",
    "BANNER",
    "CATEGORY",
    "FEATURED",
    "CUSTOM",
  ]),
  description: z.string().optional(),
  sequence: z.number().optional(),
  status: z.enum(["ACTIVE", "DEACTIVE"]).default("ACTIVE"),
  items: z.array(z.any()).optional(),
  settings: z
    .object({
      layout: z.enum(["grid", "carousel", "list", "featured"]).optional(),
      columns: z.number().min(1).max(6).optional(),
      showTitle: z.boolean().optional(),
      backgroundColor: z.string().optional(),
      textColor: z.string().optional(),
      padding: z.string().optional(),
      fullWidth: z.boolean().optional(),
      autoplay: z.boolean().optional(),
      autoplaySpeed: z.number().optional(),
      infinite: z.boolean().optional(),
    })
    .optional(),
});

// Type for individual container
type Container = z.infer<typeof containerFormSchema> & {
  id: string;
};

// SortableContainer component for drag and drop
const SortableContainer = ({
  container,
  onEdit,
  onDelete,
}: {
  container: Container;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: container.id });

  const style = {
    transform: transform ? `translate3d(0, ${transform.y}px, 0)` : undefined,
    transition,
  };

  const getContainerTypeIcon = (type: string) => {
    const containerType = CONTAINER_TYPES.find((t) => t.value === type);
    return containerType?.icon || <LayoutGrid className="h-4 w-4" />;
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab p-2 mr-2"
            >
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <div className="flex items-center">
              {getContainerTypeIcon(container.container_type)}
              <div className="ml-2">
                <CardTitle className="text-base font-medium">
                  {container.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  {CONTAINER_TYPES.find(
                    (t) => t.value === container.container_type
                  )?.label || container.container_type}{" "}
                  • Sequence: {container.sequence}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Badge
              variant={container.status === "ACTIVE" ? "default" : "secondary"}
              className="text-xs"
            >
              {container.status}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(container.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(container.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-2">
          {container.description && (
            <p className="text-sm text-gray-600 mb-2">
              {container.description}
            </p>
          )}
          {container.items && (
            <div className="text-sm">
              <span className="font-medium">Items:</span>{" "}
              {container.items.length}
            </div>
          )}
          {container.settings && (
            <div className="flex flex-wrap gap-2 mt-2">
              {container.settings.layout && (
                <Badge variant="outline" className="text-xs">
                  Layout: {container.settings.layout}
                </Badge>
              )}
              {container.settings.columns && (
                <Badge variant="outline" className="text-xs">
                  Columns: {container.settings.columns}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Container Dialog component for creating/editing containers
const ContainerDialog = ({
  isOpen,
  onClose,
  container,
  onSave,
  isLoading,
  products,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  container?: Container;
  onSave: (data: any) => void;
  isLoading: boolean;
  products: any[];
  categories: any[];
}) => {
  const form = useForm<z.infer<typeof containerFormSchema>>({
    resolver: zodResolver(containerFormSchema),
    defaultValues: container || {
      title: "",
      container_type: "PRODUCT",
      description: "",
      status: "ACTIVE",
      items: [],
      settings: {
        layout: "grid",
        columns: 4,
        showTitle: true,
      },
    },
  });

  // Reset form when container changes
  useEffect(() => {
    if (container) {
      form.reset(container);
    } else {
      form.reset({
        title: "",
        container_type: "PRODUCT",
        description: "",
        status: "ACTIVE",
        items: [],
        settings: {
          layout: "grid",
          columns: 4,
          showTitle: true,
        },
      });
    }
  }, [container, form, isOpen]);

  const containerType = form.watch("container_type");

  const handleSubmit = (data: z.infer<typeof containerFormSchema>) => {
    onSave(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {container ? "Edit Container" : "Create New Container"}
          </DialogTitle>
          <DialogDescription>
            Configure your homepage container. Different container types have
            different options.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="settings">Layout & Style</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Container title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="container_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select container type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONTAINER_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                {type.icon}
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A short description of this container"
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
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="DEACTIVE">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="items" className="space-y-4">
                {containerType === "PRODUCT" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Select Products</h3>
                    <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center space-x-2 py-2 border-b last:border-0"
                          >
                            <Controller
                              control={form.control}
                              name="items"
                              render={({ field }) => {
                                const isSelected = field.value?.some(
                                  (item: any) => item.id === product.id
                                );
                                return (
                                  <div className="flex items-center w-full">
                                    <input
                                      type="checkbox"
                                      id={`product-${product.id}`}
                                      checked={isSelected}
                                      onChange={(e) => {
                                        let newItems = [...(field.value || [])];
                                        if (e.target.checked) {
                                          newItems.push({
                                            id: product.id,
                                            sequence: newItems.length,
                                          });
                                        } else {
                                          newItems = newItems.filter(
                                            (item: any) =>
                                              item.id !== product.id
                                          );
                                        }
                                        field.onChange(newItems);
                                      }}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`product-${product.id}`}
                                      className="flex-1 cursor-pointer text-sm"
                                    >
                                      {product.title}
                                    </label>
                                  </div>
                                );
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 py-2">
                          No products found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {containerType === "CATEGORY" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Select Categories</h3>
                    <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto">
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center space-x-2 py-2 border-b last:border-0"
                          >
                            <Controller
                              control={form.control}
                              name="items"
                              render={({ field }) => {
                                const isSelected = field.value?.some(
                                  (item: any) => item.id === category.id
                                );
                                return (
                                  <div className="flex items-center w-full">
                                    <input
                                      type="checkbox"
                                      id={`category-${category.id}`}
                                      checked={isSelected}
                                      onChange={(e) => {
                                        let newItems = [...(field.value || [])];
                                        if (e.target.checked) {
                                          newItems.push({
                                            id: category.id,
                                            sequence: newItems.length,
                                          });
                                        } else {
                                          newItems = newItems.filter(
                                            (item: any) =>
                                              item.id !== category.id
                                          );
                                        }
                                        field.onChange(newItems);
                                      }}
                                      className="mr-2"
                                    />
                                    <label
                                      htmlFor={`category-${category.id}`}
                                      className="flex-1 cursor-pointer text-sm"
                                    >
                                      {category.title}
                                    </label>
                                  </div>
                                );
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 py-2">
                          No categories found
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {containerType === "BANNER" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Banner Items</h3>
                    <Controller
                      control={form.control}
                      name="items"
                      render={({ field }) => (
                        <div className="space-y-2">
                          {field.value && field.value.length > 0 ? (
                            <div className="space-y-4">
                              {field.value.map((item: any, index: number) => (
                                <div
                                  key={index}
                                  className="border rounded-md p-4"
                                >
                                  <div className="flex justify-between mb-2">
                                    <h4 className="text-sm font-medium">
                                      Banner {index + 1}
                                    </h4>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        const value = field.value ?? []; // Treat undefined as empty array
                                        const newItems = [...value];
                                        newItems.splice(index, 1);
                                        field.onChange(newItems);
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Image URL
                                      </label>
                                      <Input
                                        value={item.image}
                                        onChange={(e) => {
                                          const newItems = [
                                            ...(field.value ?? []),
                                          ];
                                          newItems[index] = {
                                            ...(newItems[index] ?? {}), // Ensure newItems[index] exists
                                            image: e.target.value,
                                          };
                                          field.onChange(newItems);
                                        }}
                                        placeholder="https://example.com/image.jpg"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Title (Optional)
                                      </label>
                                      <Input
                                        value={item.title || ""}
                                        onChange={(e) => {
                                          const newItems = [
                                            ...(field.value ?? []),
                                          ]; // Ensure field.value is an array
                                          newItems[index] = {
                                            ...(newItems[index] ?? {}), // Ensure newItems[index] exists
                                            title: e.target.value,
                                          };
                                          field.onChange(newItems);
                                        }}
                                        placeholder="Banner title"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Link (Optional)
                                      </label>
                                      <Input
                                        value={item.link || ""}
                                        onChange={(e) => {
                                          const newItems = [
                                            ...(field.value ?? []),
                                          ];
                                          newItems[index] = {
                                            ...(newItems[index] ?? {}),
                                            link: e.target.value,
                                          };
                                          field.onChange(newItems);
                                        }}
                                        placeholder="https://example.com/page"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 py-2">
                              No banner items added
                            </div>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newItems = [...(field.value || [])];
                              newItems.push({
                                image: "",
                                title: "",
                                link: "",
                                sequence: newItems.length,
                              });
                              field.onChange(newItems);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Banner
                          </Button>
                        </div>
                      )}
                    />
                  </div>
                )}

                {(containerType === "FEATURED" ||
                  containerType === "CUSTOM") && (
                  <Alert>
                    <AlertTitle>Configuration Required</AlertTitle>
                    <AlertDescription>
                      {containerType === "FEATURED"
                        ? "Featured containers combine different types of content. Configure this in the UI after creation."
                        : "Custom containers allow for flexible content. Add your custom items after creation."}
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="settings.layout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layout</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LAYOUT_OPTIONS.map((layout) => (
                              <SelectItem
                                key={layout.value}
                                value={layout.value}
                              >
                                {layout.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.columns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Columns</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select columns" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((col) => (
                              <SelectItem key={col} value={col.toString()}>
                                {col}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="settings.backgroundColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Color</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="#ffffff"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <Input
                            type="color"
                            className="w-10 p-1 h-10"
                            value={field.value || "#ffffff"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.textColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Text Color</FormLabel>
                        <div className="flex space-x-2">
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="#000000"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <Input
                            type="color"
                            className="w-10 p-1 h-10"
                            value={field.value || "#000000"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="settings.padding"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Padding</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="16px"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        CSS padding value (e.g., 16px or 1rem)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="settings.showTitle"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
                        <div>
                          <FormLabel>Show Title</FormLabel>
                          <FormDescription>
                            Display the container title on the frontend
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="settings.fullWidth"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
                        <div>
                          <FormLabel>Full Width</FormLabel>
                          <FormDescription>
                            Extend container to full width of the screen
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch("settings.layout") === "carousel" && (
                    <>
                      <FormField
                        control={form.control}
                        name="settings.autoplay"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
                            <div>
                              <FormLabel>Autoplay</FormLabel>
                              <FormDescription>
                                Automatically advance carousel slides
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("settings.autoplay") && (
                        <FormField
                          control={form.control}
                          name="settings.autoplaySpeed"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Autoplay Speed (ms)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="3000"
                                  {...field}
                                  value={field.value || 3000}
                                  onChange={(e) =>
                                    field.onChange(parseInt(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="settings.infinite"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-2 rounded-md border p-3">
                            <div>
                              <FormLabel>Infinite Loop</FormLabel>
                              <FormDescription>
                                Continuously loop through carousel items
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && (
                  <span className="mr-2 h-4 w-4 animate-spin">⟳</span>
                )}
                {container ? "Update Container" : "Create Container"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Delete Confirmation Dialog
const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Container</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this container? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin">⟳</span>}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Homepage Builder Component
const HomepageBuilder = ({ apiEndpoint }: { apiEndpoint: string }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentContainer, setCurrentContainer] = useState<
    Container | undefined
  >(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [containerToDelete, setContainerToDelete] = useState<string | null>(
    null
  );
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  // Set up DND sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle container edit
  const handleEdit = (id: string) => {
    const container = containers.find((c) => c.id === id);
    if (container) {
      setCurrentContainer(container);
      setIsDialogOpen(true);
    }
  };

  // Handle container delete
  const handleDelete = (id: string) => {
    setContainerToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete container
  const confirmDelete = async () => {
    if (!containerToDelete) return;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${apiEndpoint}/v1/homepage/homepage/containers/${containerToDelete?.replace("homepage_container:", "")}`
      );
      if (response.data.success) {
        setContainers(containers.filter((c) => c.id !== containerToDelete));
        toast({
          title: "Success",
          description: "Container deleted successfully",
        });
      }
    } catch (error) {
      console.error("Error deleting container:", error);
      toast({
        title: "Error",
        description: "Failed to delete container",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setContainerToDelete(null);
    }
  };

  // Handle container create/update
  const handleSaveContainer = async (data: any) => {
    setIsLoading(true);
    try {
      let response: any;

      if (currentContainer) {
        // Update existing container
        response = await axios.put(
          `${apiEndpoint}/v1/homepage/homepage/containers/${currentContainer.id?.replace("homepage_container:", "")}`,
          data
        );
        if (response.data.success) {
          setContainers(
            containers.map((c) =>
              c.id === currentContainer.id ? response.data.data : c
            )
          );
          toast({
            title: "Success",
            description: "Container updated successfully",
          });
        }
      } else {
        // Create new container
        response = await axios.post(
          `${apiEndpoint}/v1/homepage/homepage/containers`,
          data
        );
        if (response.data.success) {
          setContainers([...containers, response.data.data]);
          toast({
            title: "Success",
            description: "Container created successfully",
          });
        }
      }

      setIsDialogOpen(false);
      setCurrentContainer(undefined);
    } catch (error) {
      console.error("Error saving container:", error);
      toast({
        title: "Error",
        description: "Failed to save container",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle DND end
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = containers.findIndex((c) => c.id === active.id);
      const newIndex = containers.findIndex((c) => c.id === over.id);

      const newContainers = arrayMove(containers, oldIndex, newIndex);

      // Update containers with new sequence numbers
      const updatedContainers = newContainers.map(
        (container: any, index: any) => ({
          ...container,
          sequence: index + 1,
        })
      );

      setContainers(updatedContainers);

      // Save the new sequence to the backend
      try {
        await axios.put(
          `${apiEndpoint}/v1/homepage/homepage/containers/sequence`,
          {
            containers: updatedContainers.map((c) => ({
              id: c.id,
              sequence: c.sequence,
            })),
          }
        );
      } catch (error) {
        console.error("Error updating sequence:", error);
        toast({
          title: "Error",
          description: "Failed to update container sequence",
          variant: "destructive",
        });
        // Revert to original order
        fetchContainers();
      }
    }
  };

  // Load containers on mount
  useEffect(() => {
    fetchContainers();
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${apiEndpoint}/v1/products/products?limit=100`
      );
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiEndpoint}/v1/category/categories`);
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch containers from API
  const fetchContainers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiEndpoint}/v1/homepage/homepage/containers`
      );
      if (response.data.success) {
        setContainers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching containers:", error);
      toast({
        title: "Error",
        description: "Failed to load homepage containers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render the UI
  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Homepage Builder</h1>
          <p className="text-gray-500">
            Customize your homepage layout by rearranging containers
          </p>
        </div>
        <Button
          onClick={() => {
            setCurrentContainer(undefined);
            setIsDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Container
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            <p className="text-sm text-gray-600">
              Drag and drop containers to rearrange them. Changes are saved
              automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Active containers are visible on the homepage</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span>Inactive containers are hidden from the homepage</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && containers.length === 0 ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : containers.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-10">
          <div className="rounded-full bg-gray-100 p-3 mb-4">
            <Layers className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No containers found</h3>
          <p className="text-gray-500 text-center mb-4">
            Start by adding a new container to your homepage
          </p>
          <Button
            onClick={() => {
              setCurrentContainer(undefined);
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Container
          </Button>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext
            items={containers.map((container) => container.id)}
            strategy={verticalListSortingStrategy}
          >
            {containers.map((container) => (
              <SortableContainer
                key={container.id}
                container={container}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Container Create/Edit Dialog */}
      <ContainerDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setCurrentContainer(undefined);
        }}
        container={currentContainer}
        onSave={handleSaveContainer}
        isLoading={isLoading}
        products={products}
        categories={categories}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setContainerToDelete(null);
        }}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </div>
  );
};
export default HomepageBuilder;
