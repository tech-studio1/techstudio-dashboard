"use server";
import { auth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export const handleGetDashboardAnalytics = async (): Promise<any> => {
  const uri = `${process.env.BASE_URL}/v1/analytics/analytics/dashboard`;
  const session = await auth();
  try {
    const response = await fetch(uri, {
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
