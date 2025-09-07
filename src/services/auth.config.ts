import type { NextAuthConfig } from "next-auth";
import { jwtDecode } from "jwt-decode";

// import { NextResponse } from "next/server";

async function refreshAccessToken(sid: unknown) {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/v1/auth/authentication/refresh?sid=` + sid,
      {
        method: "POST",
        headers: {
          "Contet-Type": "application/json",
        },
      }
    );

    const tokens = await response.json();
    // console.log({ tokens, pp: process.env.BASE_URL, sid });
    if (tokens?.data?.token) {
      return { ...tokens?.data };
    } else {
      return { error: "RefreshAccessTokenError" };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // console.log({ error });
    return {
      error: "RefreshAccessTokenError",
      message: error?.message,
    };
  }
}

export const authConfig = {
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicPaths = [
        "/signin",
        "/signup",
        "/forgot-password",
        "/account-verification",
      ];
      const path = nextUrl.pathname;

      // Redirect logged-in users away from public paths
      if (publicPaths.includes(path)) {
        return isLoggedIn
          ? Response.redirect(new URL("/", nextUrl.origin))
          : true;
      }

      // Protect dashboard routes
      if (path.startsWith("/dashboard")) {
        return isLoggedIn;
      }

      // Require authentication for all other routes
      if (!isLoggedIn) {
        return Response.redirect(new URL("/signin", nextUrl.origin));
      }
      // Allow access to authenticated users
      return true;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jwt: async ({ token, account, user }: any) => {
      // console.log(`In jwt callback - Token is ${JSON.stringify(user)}`);
      // console.log({ token, account, user });
      if (token?.user?.token) {
        const decodedToken = jwtDecode(token.user?.token);
        token.accessTokenExpires =
          decodedToken && decodedToken?.exp ? decodedToken?.exp * 1000 : 1;
      }

      if (account && user) {
        return {
          ...token,
          user,
        };
      }

      if (Date.now() < token.accessTokenExpires) {
        // console.log("**** returning previous token ******");
        return token;
      }

      // return refreshAccessToken(token?.user?.sid);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token?.user?.token) {
        session.token = token?.user?.token;
        const finalUser = Object.assign({}, token?.user);
        delete finalUser.token;
        delete finalUser.sid;
        delete finalUser.tokenType;
        session.user = finalUser;
        return session;
      } else {
        return session;
      }
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
