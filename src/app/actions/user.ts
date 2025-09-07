"use server";

import { auth } from "@/services/auth";

export const getProfile = async () => {
  const session = await auth();
  console.log("SESSION", session);
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/v1/auth/authentication/profile`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
      }
    );
    const result = await response.json();
    // console.log(JSON.stringify(result, null, 2));
    return result?.data; // Explicitly cast the response if necessary
  } catch (error) {
    console.error(error);
  }
};
