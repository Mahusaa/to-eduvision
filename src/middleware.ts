import { NextResponse, type NextRequest, } from "next/server";
import { auth } from "./server/auth";

// List of public routes that don't require authentication

const publicRoutes = ["/", "/about", "/contact"];

// Routes that should only be accessible to non-authenticated users
const authRoutes = ["/sign-in"];

// Routes that require admin privileges
const adminRoutes = ["/edit", "/edit/users", "/edit/tryout"];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.includes(pathname);

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // If the user is not logged in and trying to access a protected route
  if (!session && !isPublicRoute && !isAuthRoute) {
    // Redirect them to login page
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If the user is logged in and trying to access auth routes
  if (session && isAuthRoute) {
    // Redirect them to home page or dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the user is not an admin and trying to access admin routes
  if (isAdminRoute && session?.user.role !== "admin") {
    // Redirect them to home page with error
    return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Configure which routes should use this middleware
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
