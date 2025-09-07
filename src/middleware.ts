import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  permissions?: string[];
  roles?: string[];
  exp?: number; // Add expiration time
  [key: string]: any;
}

interface Token {
  user?: {
    token: string;
    [key: string]: any;
  };
  [key: string]: any;
}

// Define route permissions mapping
const routePermissions: Record<string, string[]> = {
  // Main page is open for all authenticated users
  "/": [],

  // Order related routes
  "/orders": ["ORDER", "ALL"],
  "/orders/create": ["ORDER", "ALL"],
  "/orders/[id]": ["ORDER", "ALL"],

  // In-Store Order related routes
  "/in-store-orders": ["IN_STORE_ORDER", "ALL"],
  "/in-store-orders/create": ["IN_STORE_ORDER", "ALL"],
  "/in-store-orders/[id]": ["IN_STORE_ORDER", "ALL"],

  // Transaction related routes
  "/transactions": ["TRANSACTION", "ALL"],
  "/transactions/[id]": ["TRANSACTION", "ALL"],

  // Product related routes
  "/products": ["PRODUCT", "ALL"],
  "/products/create": ["PRODUCT", "ALL"],
  "/products/[id]": ["PRODUCT", "ALL"],

  // Inventory related routes
  "/inventory": ["INVENTORY", "ALL"],
  "/inventory/create": ["INVENTORY", "ALL"],
  "/inventory/[id]": ["INVENTORY", "ALL"],

  // Brand related routes
  "/brands": ["BRAND", "ALL"],
  "/brands/create": ["BRAND", "ALL"],
  "/brands/[id]": ["BRAND", "ALL"],

  // Category related routes
  "/categories": ["CATEGORY", "ALL"],
  "/categories/create": ["CATEGORY", "ALL"],
  "/categories/[id]": ["CATEGORY", "ALL"],

  // Discount related routes
  "/discounts": ["DISCOUNT", "ALL"],
  "/discounts/create": ["DISCOUNT", "ALL"],
  "/discounts/[id]": ["DISCOUNT", "ALL"],

  // Builder related routes
  "/builders": ["BUILDER", "ALL"],
  "/builders/create": ["BUILDER", "ALL"],
  "/builders/[id]": ["BUILDER", "ALL"],

  // Customer related routes
  "/customers": ["CUSTOMER", "ALL"],
  "/customers/[id]": ["CUSTOMER", "ALL"],

  // Staff related routes
  "/staff": ["STAFF", "ALL"],
  "/staff/create": ["STAFF", "ALL"],
  "/staff/[id]": ["STAFF", "ALL"],
};

// Define public paths that don't require authentication
const publicPaths = [
  "/signin",
  "/signup",
  "/forgot-password",
  "/account-verification",
  "/unauthorized", // Add unauthorized to public paths
];

function clearAuthCookies(response: NextResponse) {
  // Clear NextAuth cookies
  response.cookies.delete("next-auth.session-token");
  response.cookies.delete("__Secure-next-auth.session-token");
  response.cookies.delete("next-auth.csrf-token");
  response.cookies.delete("__Host-next-auth.csrf-token");
  response.cookies.delete("next-auth.callback-url");
  response.cookies.delete("__Secure-next-auth.callback-url");

  // Add any other auth-related cookies you might have
  // response.cookies.delete("your-custom-auth-cookie");

  return response;
}

function isTokenExpired(token: DecodedToken): boolean {
  if (!token.exp) return false;

  const currentTime = Math.floor(Date.now() / 1000);
  return token.exp < currentTime;
}

export async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname;

    // Get the token
    const token = (await getToken({
      req,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.VERCEL_ENV === "production" ? true : false,
    })) as Token;

    // Handle public paths
    if (publicPaths.includes(path)) {
      // If user is authenticated and tries to access a public path, redirect to home
      if (token) {
        // Still need to validate the token even for public paths
        try {
          const decodedToken = jwtDecode<DecodedToken>(token.user?.token || "");

          // Check if token is expired
          if (isTokenExpired(decodedToken)) {
            // console.log(
            //   "Token expired, clearing cookies and allowing access to public path"
            // );
            const response = NextResponse.next();
            return clearAuthCookies(response);
          }

          return NextResponse.redirect(new URL("/", req.url));
        } catch (jwtError) {
          const response = NextResponse.next();
          return clearAuthCookies(response);
        }
      }
      // Allow unauthenticated access to public paths
      return NextResponse.next();
    }

    // Handle unauthenticated access
    if (!token) {
      // For unauthenticated users, redirect to signin
      const response = NextResponse.redirect(new URL("/signin", req.url));
      return clearAuthCookies(response);
    }

    // Decode and validate the JWT token
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwtDecode<DecodedToken>(token.user?.token || "");

      // Check if token is expired
      if (isTokenExpired(decodedToken)) {
        const response = NextResponse.redirect(new URL("/signin", req.url));
        return clearAuthCookies(response);
      }
    } catch (jwtError) {
      const response = NextResponse.redirect(new URL("/signin", req.url));
      return clearAuthCookies(response);
    }

    const userPermissions = decodedToken.permissions || [];

    // If path is "/", allow access for all authenticated users
    if (path === "/") {
      return NextResponse.next();
    }

    // Check if the current path requires specific permissions
    const requiredPermissions = routePermissions[path];

    // If no permissions are required for this path, allow access
    if (!requiredPermissions) {
      return NextResponse.next();
    }

    // If user has "ALL" permission, allow access to everything
    if (userPermissions.includes("ALL")) {
      return NextResponse.next();
    }

    // Check if user has any of the required permissions
    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On error, clear cookies and redirect to signin for safety
    const response = NextResponse.redirect(new URL("/signin", req.url));
    return clearAuthCookies(response);
  }
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$|_next).*)"],
};
