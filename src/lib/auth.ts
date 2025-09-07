import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./signin-schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // console.log(
        //   "CRED",
        //   JSON.stringify({
        //     username: credentials?.username,
        //     password: credentials?.password,
        //   })
        // );
        try {
          const { username, password } =
            await signInSchema.parseAsync(credentials);

          const res = await fetch(`${process.env.BASE_URL}/auth/admin/signin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              password: password,
            }),
          });
          const user = await res.json();

          if (!user) {
            throw new Error("User not found.");
          }
          const newUser = { ...user, accessToken: user?.access_token };
          // return JSON object with the user data
          // console.log("user", newUser);
          return newUser;
        } catch (error) {
          // console.log("ERxrror", error);
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
});
