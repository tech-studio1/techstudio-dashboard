import { cn } from "@/lib/utils";
import React from "react";
import ThemeSwitch from "../theme-switch";

function ThemeHeader() {
  return (
    <div
      data-layout="header"
      className={cn(
        "z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 md:px-8 shadow flex-none sticky top-0"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div></div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}

export default ThemeHeader;
