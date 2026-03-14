import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import SessionProvider from "@/components/layout/SessionProvider";
import { SchemaOrg } from "@/components/SchemaOrg";

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Meta" });

  const ogLocale = locale === "sv" ? "sv_SE" : "en_US";
  const canonicalUrl = `https://www.bookvra.com/${locale}`;

  return {
    title: {
      default: t("title"),
      template: "%s | BookVra",  // child pages: "Pricing | BookVra"
    },
    description: t("description"),

    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: "https://www.bookvra.com/en",
        sv: "https://www.bookvra.com/sv",
        "x-default": "https://www.bookvra.com/en",
      },
    },

    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "BookVra",
      locale: ogLocale,
      type: "website",
      // Uncomment once you have an OG image:
      // images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BookVra" }],
    },

    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <SchemaOrg />
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>{children}</SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
