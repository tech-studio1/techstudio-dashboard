import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        identifier: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { identifier, password } = credentials;
          const response = await fetch(
            `${process.env.BASE_URL}/v1/auth/authentication/signin-staff`,
            // `${process.env.BASE_URL}/v1/auth/authentication/signin`,
            {
              method: "POST",
              body: JSON.stringify({ identifier, password }),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );
          const result = await response.json();

          if (result?.data?.token) {
            return { ...result?.data };
          } else {
            return undefined;
          }
        } catch (error) {
          console.log(error);
          return undefined;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
