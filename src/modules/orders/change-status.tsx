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
import StatusForm from "./status-form";
const ChangeStatus = ({ id, status }: { id: string; status: string }) => {
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
            <p>Change Status</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Order Status</DialogTitle>
        </DialogHeader>
        <StatusForm id={id} cstatus={status} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ChangeStatus;
