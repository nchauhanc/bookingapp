import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Public paths (locale-stripped)
const PUBLIC_EXACT = new Set(["/", "/login", "/register", "/browse", "/pricing", "/about", "/privacy", "/terms", "/verify-email"]);
const PUBLIC_PREFIXES = ["/p/", "/api/"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API routes, sitemap and robots bypass locale middleware entirely
  if (pathname.startsWith("/api/")) return NextResponse.next();
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") return NextResponse.next();

  // Strip locale prefix (/en, /sv) to get canonical path
  const bare = pathname.replace(/^\/(en|sv)/, "") || "/";

  const isPublic =
    PUBLIC_EXACT.has(bare) ||
    PUBLIC_PREFIXES.some((p) => bare.startsWith(p));

  if (!isPublic) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const locale = pathname.match(/^\/(en|sv)/)?.[1] ?? "en";

    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    const role = token.role as string | undefined;
    const needsOnboarding = token.needsOnboarding as boolean | undefined;

    if (
      needsOnboarding &&
      !bare.startsWith("/onboarding") &&
      !bare.startsWith("/api/onboarding") &&
      !bare.startsWith("/api/auth")
    ) {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/onboarding`;
      return NextResponse.redirect(url);
    }

    if (bare.startsWith("/professional") && role !== "PROFESSIONAL") {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/customer`;
      return NextResponse.redirect(url);
    }

    if (bare.startsWith("/customer") && role !== "CUSTOMER") {
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/professional`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Exclude static assets, images, sitemap, robots from middleware
    "/((?!_next/static|_next/image|favicon.ico|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
