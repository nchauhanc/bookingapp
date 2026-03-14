import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL =
  process.env.NEXTAUTH_URL?.replace(/\/$/, "") ?? "https://bookvra.com";

const LOCALES = ["en", "sv"] as const;

/** Static public pages and their rough priority */
const STATIC_ROUTES: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "",         priority: 1.0, freq: "weekly"  }, // home
  { path: "/browse",  priority: 0.9, freq: "daily"   }, // browse changes as pros join
  { path: "/pricing", priority: 0.7, freq: "monthly" },
  { path: "/about",   priority: 0.6, freq: "monthly" },
  { path: "/privacy", priority: 0.3, freq: "yearly"  },
  { path: "/terms",   priority: 0.3, freq: "yearly"  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static entries — one URL per locale
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    ({ path, priority, freq }) =>
      LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: freq,
        priority,
      }))
  );

  // Dynamic professional booking pages — only listed pros
  const professionals = await prisma.user.findMany({
    where: { role: "PROFESSIONAL", isListed: true },
    select: { id: true, username: true, updatedAt: true },
  });

  const proEntries: MetadataRoute.Sitemap = professionals.flatMap((pro) => {
    const handle = pro.username ?? pro.id;
    return LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/p/${handle}`,
      lastModified: pro.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));
  });

  return [...staticEntries, ...proEntries];
}
