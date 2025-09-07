import { handleGetSingleStaff } from "@/app/actions/staffs";
import React from "react";
import UpdateStaffForm from "./update-form";

async function UpdateStaffModule({ id }: { id: string }) {
  const staff = await handleGetSingleStaff(id);

  return <UpdateStaffForm staff={staff?.data} />;
}

export default UpdateStaffModule;
