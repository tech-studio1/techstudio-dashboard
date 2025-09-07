"use server";

import { auth } from "@/services/auth";

export type CurrentSessionAccount = {
  sub: string;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  auth_time: number;
  roles: string[];
  sid: string;
  device_id: string;
  status: "ACTIVE" | "INACTIVE" | string;
};

export type CurrentSessionUser = {
  account_hash: string;
  created_at: string;
  groups: string[];
  id: string;
  onboarding_status: "PENDING" | "COMPLETED" | string;
  permissions: string[];
  profile: {
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
  }[];
  role: "SUPER" | "ADMIN" | "STAFF" | "CUSTOMER" | string;
  status: "ACTIVE" | "INACTIVE" | string;
  updated_at: string;
};

export type CurrentSessionData = {
  account: CurrentSessionAccount;
  user: CurrentSessionUser[];
};

export interface ApiResponse {
  data: CurrentSessionData;
  success: boolean;
  message: string;
}

export const handleGetCurrentSession = async (): Promise<ApiResponse> => {
  const base_uri = `${process.env.BASE_URL}/v1/auth/authentication/current-session`;
  const session = await auth();

  try {
    const response = await fetch(base_uri, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
    });
    const result = await response.json();

    return result;
  } catch (error) {
    throw error;
  }
};
