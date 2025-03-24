import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

    // If trying to access admin route but not authenticated, redirect to login
    if (isAdminRoute && !token) {
       return NextResponse.redirect(new URL("/admin/auth", req.url));
    }

    if(req.nextUrl.pathname.startsWith("/admin/auth")){
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Allow access to non-admin routes
    if (!isAdminRoute) {
      return NextResponse.next();
    }
 
    // For admin routes, check if user has admin role
    // If not admin, redirect to home page
    if (!token?.isAdmin) {
     return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes to protect
export const config = {
  matcher: [
    "/admin/:path*",  // Protect all admin routes
    "/api/admin/:path*",  // Protect admin API routes
  ],
};