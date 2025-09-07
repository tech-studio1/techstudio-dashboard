import Fullloader from "@/components/common/loader/fullloader";
import UpdateStaffModule from "@/modules/staffs/update-staff";
import React, { Suspense } from "react";

async function CreateStaffPage(props: {
  params?: Promise<{
    id?: string;
  }>;
}) {
  const searchParams = await props.params;
  const id = searchParams?.id || "";
  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4 bg-primary/5 p-2 rounded-xl">
            <div className="bg-primary/10 px-3 py-1 rounded-lg text-primary text-sm font-medium">
              Staff Management
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-3">
            Update Staff
          </h1>
        </div>
        <Suspense key={id} fallback={<Fullloader />}>
          <UpdateStaffModule id={id} />
        </Suspense>
      </div>
    </div>
  );
}

export default CreateStaffPage;
