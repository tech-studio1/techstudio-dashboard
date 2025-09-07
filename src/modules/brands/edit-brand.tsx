"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BrandForm } from "./add-brand/brand-form";
const EditBrand = ({ id }: { id: string }) => {
  //   console.log(id);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger>
              <Settings2 />
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Brand</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
        </DialogHeader>
        <BrandForm edit={true} id={id} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default EditBrand;
