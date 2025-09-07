"use server";

import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export type AccountGroup =
  | "account_group:customer"
  | "account_group:staff"
  | string;

export interface Mobile {
  country_code: string;
  created_at: string;
  formatted_number: string;
  id: string;
  in: string;
  is_primary: boolean;
  mobile: string;
  out: string;
  updated_at: string;
}

export interface Profile {
  created_at: string;
  date_of_birth: string;
  first_name: string;
  full_name: string;
  gender: "MALE" | "FEMALE" | string;
  id: string;
  in: string;
  last_name: string;
  out: string;
  updated_at: string;
}

export interface Staff {
  created_at: string;
  updated_at: string;
  id: string;
  groups: AccountGroup[];
  mobiles: Mobile[];
  profile: Profile;
  permissions: string[];
  role: string;
  onboarding_status: "PENDING" | "COMPLETED" | string;
  status: "ACTIVE" | "INACTIVE" | string;
}

export interface Meta {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

export interface ApiResponse {
  data: Staff[];
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}
export interface SingleStaffApiResponse {
  data: Staff;
  meta: Meta;
  success: boolean;
  message: string;
  status: number;
}

export const handleGetStaffs = async ({
  page,
  limit,
  search,
}: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/staff/staffs`;
  const session = await auth();
  const params = new URLSearchParams();

  if (limit !== undefined) params.append("limit", limit.toString());
  if (page !== undefined) params.append("page", page.toString());
  if (search !== undefined) params.append("search", search);

  const url = `${base_uri}${params.toString() ? `?${params.toString()}` : ""}`;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleCreateStaff = async ({ body }: { body: any }) => {
  const uri = `${process.env.BASE_URL}/v1/staff/staffs`;
  const session = await auth();
  // console.log({ uri, t: session?.token });
  // console.log(JSON.stringify(body));
  try {
    const response = await fetch(uri, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });

    console.log(response);
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleGetSingleStaff = async (
  id: string
): Promise<SingleStaffApiResponse> => {
  // console.log("order", id);
  const session = await auth();
  // console.log("called with id", id);
  // console.log(session);
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/v1/staff/staffs/${id}`,
      {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const result = await response.json();
    if (result?.success) {
      return result;
    } else {
      throw new Error("Failed to fetch staffs");
    }
  } catch (error) {
    throw new Error("Failed to fetch staff data");
  }
};

export const handleUpdateStaff = async ({
  body,
  id,
}: {
  body: any;
  id: string;
}) => {
  const uri = `${process.env.BASE_URL}/v1/staff/staffs/${id}`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();
    if (!result.success) {
      throw new Error("Bad Request");
    }
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
