import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Circle, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { handleDeleteCategory } from "@/app/actions/categories";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleDeleteBrand } from "@/app/actions/brands";
const DeleteBrand = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const deleteAction = async () => {
    setIsLoading(true);
    try {
      await handleDeleteBrand(id);
      toast("Brand has been deleted");
      router.refresh();
      setIsLoading(false);
      setIsOpen(false);
    } catch (error) {
      toast("Somethin went wrong");
      setIsLoading(false);
      setIsOpen(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <Trash2 />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            brand and remove your brand data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-fit">
          <Button
            onClick={deleteAction}
            className="w-full"
            variant={"destructive"}
            disabled={isLoading}
          >
            {isLoading ? (
              <Circle className="animate-spin duration-300 ease-in-out transition-all" />
            ) : (
              <span>Confirm</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBrand;
