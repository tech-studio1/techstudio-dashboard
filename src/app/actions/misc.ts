"use server";

import { auth } from "@/services/auth";

export async function handlePresignedUrl(body: any) {
  const session = await auth();
  const token = session?.token;
  try {
    if (!token) {
      throw new Error("No token found. Please presigned");
    }

    const formData = new FormData();
    // formData.append('key', filename);
    const response = await fetch(
      `${process.env.BASE_URL}/v1/r2/r2/put-presigned-url`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        // body: formData,
        body: JSON.stringify(body),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to get presigned url");
    }

    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
}
