import { cn } from "@/lib/utils";
import React from "react";
import ThemeSwitch from "../theme-switch";
import { UserNav } from "./user-nav";
import { CurrentSessionData } from "@/app/actions/current-session";

function Header({ data }: { data: CurrentSessionData }) {
  return (
    <div
      data-layout="header"
      className={cn(
        "z-10 flex h-[var(--header-height)] items-center gap-4 bg-background p-4 md:px-8 shadow flex-none sticky top-0"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <div>
          {/* <Input
            type="search"
            placeholder="Search..."
            className="md:w-[100px] lg:w-[300px]"
          /> */}
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav user={data?.user?.[0]?.profile?.[0]} />
        </div>
      </div>
    </div>
  );
}

export default Header;
