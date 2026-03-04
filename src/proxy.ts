import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const needsOnboarding = token?.needsOnboarding;

    // New Google users must choose their role before accessing anything else
    if (
      needsOnboarding &&
      !pathname.startsWith("/onboarding") &&
      !pathname.startsWith("/api/onboarding") &&
      !pathname.startsWith("/api/auth")
    ) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Skip role-based protection for onboarding routes
    if (pathname.startsWith("/onboarding") || pathname.startsWith("/api/onboarding")) {
      return NextResponse.next();
    }

    // Role-based route protection
    if (pathname.startsWith("/professional") && role !== "PROFESSIONAL") {
      return NextResponse.redirect(new URL("/customer", req.url));
    }
    if (pathname.startsWith("/customer") && role !== "CUSTOMER") {
      return NextResponse.redirect(new URL("/professional", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes — no token required
        if (
          pathname === "/" ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/register") ||
          pathname.startsWith("/api/auth") ||
          pathname.startsWith("/api/register") ||
          pathname.startsWith("/p/") ||
          pathname.startsWith("/verify-email") ||
          pathname.startsWith("/api/auth/verify-email")
        ) {
          return true;
        }
        // All other routes (including /onboarding) require a signed-in user
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
