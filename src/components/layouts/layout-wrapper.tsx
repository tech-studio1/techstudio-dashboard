"use client";

import { CurrentSessionData } from "@/app/actions/current-session";
import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import { cn } from "@/lib/utils";

export default function DashboardLayoutWrapper({
  data,
  children,
}: Readonly<{
  children: React.ReactNode;
  data: CurrentSessionData;
}>) {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();

  return (
    <>
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        permissions={data?.user?.[0]?.permissions}
      />
      <main
        id="content"
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? "md:ml-14" : "md:ml-64"
        } h-full`}
      >
        <div data-layout="layout" className={cn("h-full overflow-auto ")}>
          <Header data={data} />
          {children}
        </div>
      </main>
    </>
  );
}
