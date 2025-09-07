"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { Category, handleGetSingleCategory } from "@/app/actions/categories";

const ViewCategory = ({ id }: { id: string }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dataCache = useRef<{ id: string; data: Category } | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      if (dataCache.current?.id === id) {
        setCategory(dataCache.current.data);
        setLoading(false);
        return;
      }

      const getData = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await handleGetSingleCategory(id);

          if (!isMounted) return;

          if (result?.data) {
            dataCache.current = { id, data: result.data };
            setCategory(result.data);
          } else {
            setError("Category not found");
          }
        } catch (err) {
          if (!isMounted) return;
          setError("Failed to fetch category data");
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      };

      getData();
    }

    return () => {
      isMounted = false;
    };
  }, [open, id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <Eye />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Category Details</DialogTitle>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : category ? (
            <div className="space-y-4">
              <div>
                <strong>Title:</strong> {category.title}
              </div>
              <div>
                <strong>Description:</strong> {category.description}
              </div>
              <div>
                <strong>Status:</strong> {category.status}
              </div>
              <div>
                <strong>Sequence:</strong> {category?.sequence}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(category.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(category.updated_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Slug:</strong> {category.slug}
              </div>
              <div>
                <strong>Medias:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {category?.medias?.map((mediaUrl, index) => (
                    <picture key={index}>
                      <img
                        src={mediaUrl}
                        alt={`Media ${index + 1}`}
                        className="w-24 h-24 object-cover rounded"
                      />
                    </picture>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>No data available</div>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
export default ViewCategory;
