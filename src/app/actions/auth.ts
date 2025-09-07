"use server";

import { auth, signIn, signOut } from "@/services/auth";
import { cookies } from "next/headers";

export async function SignIn(body: any) {
  const res = await signIn("credentials", {
    ...body,
    redirectTo: "/",
    redirect: false,
  });
  // console.log('action', res);
  return res;
}

type SignUpBody = {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  countryCode: string;
};
export const handleSignUp = async (body: SignUpBody) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/authentication/signup`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    // console.log(response);
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleVerifyOtp = async (body: {
  token: string;
  code: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/authentication/verify-account`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

export const handleResendOtp = async (body: { token: string }) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/authentication/verify-account`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const result = await response.json();
    // console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};
export const handleLogOut = async () => {
  const session = await auth();
  const token = session?.token;
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid");
  const url = `${process.env.BASE_URL}/v1/auth/authentication/signout`;

  // console.log(auth_token?.value);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json();
    // console.log("signout", result);
    if (sid?.value) {
      cookieStore.delete("sid");
    }
    cookieStore.delete("currentLocation");
    cookieStore.delete("town");

    await signOut({ redirectTo: "/", redirect: false });
    // console.log(result);
  } catch (error) {
    // console.log(error);
    throw error;
  }
  // redirect('/auth/login');
};
