import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          // Auth flows — no SEO value
          "/*/login",
          "/*/register",
          "/*/onboarding",
          "/*/verify-email",
          // Dashboard areas — logged-in only, no SEO value
          "/*/dashboard",
          "/*/dashboard/",
          "/*/professional",
          "/*/professional/",
          "/*/customer",
          "/*/customer/",
          // API routes
          "/api/",
        ],
      },
    ],
    sitemap: "https://www.bookvra.com/sitemap.xml",
  };
}
