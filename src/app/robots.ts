import { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://bookvra.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          // Dashboard areas — logged-in only, no SEO value
          "/*/professional",
          "/*/professional/",
          "/*/customer",
          "/*/customer/",
          // Auth flows
          "/*/login",
          "/*/register",
          "/*/onboarding",
          "/*/verify-email",
          // API routes
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
