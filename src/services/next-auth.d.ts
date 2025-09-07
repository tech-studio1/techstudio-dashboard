// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    token?: string; // Add your custom token property
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // Add other custom properties here if needed
    };
  }

  interface JWT {
    accessTokenExpires?: number; // Add access token expiration property
    user?: {
      token?: string; // Add your custom token property
      sid?: string; // Add session ID if applicable
      // Add other custom properties here if needed
    };
  }
}
