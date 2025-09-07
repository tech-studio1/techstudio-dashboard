import DashboardLayoutWrapper from "@/components/layouts/layout-wrapper";
import { getProfile } from "../actions/user";
import { handleGetCurrentSession } from "../actions/current-session";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentSession = await handleGetCurrentSession();

  return (
    <div className="relative min-h-svh h-full overflow-hidden bg-card">
      <DashboardLayoutWrapper data={currentSession?.data}>
        {children}
      </DashboardLayoutWrapper>
    </div>
  );
}
