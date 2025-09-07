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
import { Brand, handleGetSingleBrand } from "@/app/actions/brands";

const ViewBrand = ({ id }: { id: string }) => {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const dataCache = useRef<{ id: string; data: Brand } | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (open) {
      if (dataCache.current?.id === id) {
        setBrand(dataCache.current.data);
        setLoading(false);
        return;
      }

      const getData = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await handleGetSingleBrand(id);

          if (!isMounted) return;

          if (result?.data) {
            dataCache.current = { id, data: result.data };
            setBrand(result.data);
          } else {
            setError("Brand not found");
          }
        } catch (err) {
          if (!isMounted) return;
          setError("Failed to fetch brand data");
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
            <p>View Brand</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Brand Details</DialogTitle>

          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : brand ? (
            <div className="space-y-4">
              <div>
                <strong>Title:</strong> {brand.title}
              </div>
              <div>
                <strong>Status:</strong> {brand.status}
              </div>
              <div>
                <strong>Sequence:</strong> {brand?.sequence}
              </div>
              <div>
                <strong>Created At:</strong>{" "}
                {new Date(brand.created_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Updated At:</strong>{" "}
                {new Date(brand.updated_at).toLocaleDateString()}
              </div>
              <div>
                <strong>Slug:</strong> {brand.slug}
              </div>
              <div>
                <strong>Medias:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {brand?.medias?.map((mediaUrl, index) => (
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
export default ViewBrand;
